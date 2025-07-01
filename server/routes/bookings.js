const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/bookings
// @desc    Get user's bookings
// @access  Private
router.get('/', [
  auth,
  query('status').optional().isIn(['pending', 'confirmed', 'completed', 'cancelled', 'no-show']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter based on user role
    const filter = {};
    if (req.user.role === 'customer') {
      filter.customer = req.user.id;
    } else if (req.user.role === 'provider') {
      filter.provider = req.user.id;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const bookings = await Booking.find(filter)
      .populate('customer', 'name email profile.phone')
      .populate('provider', 'name email profile.phone')
      .populate('service', 'title duration price category')
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Booking.countDocuments(filter);

    res.json({
      success: true,
      bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private (Customer only)
router.post('/', [
  auth,
  body('serviceId').isMongoId().withMessage('Valid service ID is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('time.start').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid start time is required'),
  body('time.end').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid end time is required'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { serviceId, date, time, notes } = req.body;

    // Get service details
    const service = await Service.findById(serviceId).populate('provider');
    if (!service || !service.isActive) {
      return res.status(404).json({ message: 'Service not found or inactive' });
    }

    // Check if date is in the future
    const bookingDate = new Date(date);
    if (bookingDate < new Date()) {
      return res.status(400).json({ message: 'Cannot book for past dates' });
    }

    // Check for existing booking conflicts
    const existingBooking = await Booking.findOne({
      provider: service.provider._id,
      date: bookingDate,
      'time.start': time.start,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'Time slot is already booked' });
    }

    // Create booking
    const booking = await Booking.create({
      customer: req.user.id,
      service: serviceId,
      provider: service.provider._id,
      date: bookingDate,
      time,
      notes,
      paymentAmount: service.price
    });

    await booking.populate(['customer', 'provider', 'service']);

    res.status(201).json({
      success: true,
      booking
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/bookings/:id
// @desc    Update booking
// @access  Private
router.put('/:id', [
  auth,
  body('status').optional().isIn(['pending', 'confirmed', 'completed', 'cancelled', 'no-show']),
  body('notes').optional().isLength({ max: 500 }),
  body('cancellationReason').optional().isLength({ max: 200 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization
    const isCustomer = booking.customer.toString() === req.user.id;
    const isProvider = booking.provider.toString() === req.user.id;

    if (!isCustomer && !isProvider) {
      return res.status(401).json({ message: 'Not authorized to update this booking' });
    }

    // Restrict status updates based on role
    if (req.body.status) {
      if (isCustomer && ['confirmed', 'completed', 'no-show'].includes(req.body.status)) {
        return res.status(403).json({ message: 'Customers cannot set this status' });
      }
      if (isProvider && req.body.status === 'pending') {
        return res.status(403).json({ message: 'Providers cannot reset status to pending' });
      }
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate(['customer', 'provider', 'service']);

    res.json({
      success: true,
      booking: updatedBooking
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/bookings/availability/:serviceId
// @desc    Get available time slots for a service on a specific date
// @access  Public
router.get('/availability/:serviceId', [
  query('date').isISO8601().withMessage('Valid date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { serviceId } = req.params;
    const { date } = req.query;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const bookingDate = new Date(date);
    const dayOfWeek = bookingDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

    // Get service availability for the day
    const dayAvailability = service.availability[dayOfWeek];
    if (!dayAvailability || !dayAvailability.enabled) {
      return res.json({
        success: true,
        availableSlots: []
      });
    }

    // Get existing bookings for the date
    const existingBookings = await Booking.find({
      provider: service.provider,
      date: bookingDate,
      status: { $in: ['pending', 'confirmed'] }
    });

    // Generate available slots based on service availability and existing bookings
    const availableSlots = [];
    dayAvailability.slots.forEach(slot => {
      const startTime = slot.start;
      const endTime = slot.end;
      
      // Check if this slot conflicts with existing bookings
      const hasConflict = existingBookings.some(booking => 
        booking.time.start === startTime
      );

      if (!hasConflict) {
        availableSlots.push({
          start: startTime,
          end: endTime,
          duration: service.duration
        });
      }
    });

    res.json({
      success: true,
      availableSlots
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;