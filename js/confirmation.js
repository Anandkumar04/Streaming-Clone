// Confirmation Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    loadBookingDetails();
    setupSharingFunctions();
    setupCalendarFunctions();
});

function loadBookingDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const bookingId = urlParams.get('booking');
    
    if (bookingId) {
        const bookingData = getBookingData(bookingId);
        if (bookingData) {
            populateBookingDetails(bookingData);
        } else {
            // If booking not found, redirect to services
            showNotification('Booking not found. Please try booking again.', 'error');
            setTimeout(() => {
                window.location.href = 'services.html';
            }, 3000);
        }
    } else {
        // No booking ID, redirect to services
        window.location.href = 'services.html';
    }
}

function getBookingData(bookingId) {
    // Try to get from localStorage first (from booking flow)
    const lastBooking = localStorage.getItem('lastBooking');
    if (lastBooking) {
        const booking = JSON.parse(lastBooking);
        if (booking.bookingId === bookingId) {
            return booking;
        }
    }
    
    // If not found, return mock data for demo
    return {
        bookingId: bookingId,
        service: {
            name: 'General Consultation',
            description: 'Comprehensive health checkup with certified doctors',
            price: 75,
            duration: '45 minutes',
            icon: '🏥'
        },
        provider: 'Dr. Sarah Smith',
        appointment: {
            formatted: {
                date: 'December 15, 2024',
                time: '2:00 PM'
            }
        },
        customer: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '(555) 123-4567'
        },
        status: 'confirmed',
        createdAt: new Date().toISOString()
    };
}

function populateBookingDetails(booking) {
    // Booking ID
    document.getElementById('bookingId').textContent = booking.bookingId;
    
    // Service details
    if (booking.service) {
        document.getElementById('confirmService').textContent = booking.service.name;
        document.getElementById('confirmDuration').textContent = booking.service.duration;
        document.getElementById('confirmPrice').textContent = `$${booking.service.price}`;
    }
    
    // Provider
    if (booking.provider) {
        const providerText = booking.provider === '' ? 'Any available provider' : booking.provider;
        document.getElementById('confirmProvider').textContent = providerText;
    }
    
    // Appointment details
    if (booking.appointment) {
        document.getElementById('confirmDate').textContent = booking.appointment.formatted.date;
        document.getElementById('confirmTime').textContent = booking.appointment.formatted.time;
    }
    
    // Customer details
    if (booking.customer) {
        document.getElementById('confirmCustomerName').textContent = 
            `${booking.customer.firstName} ${booking.customer.lastName}`;
        document.getElementById('confirmEmail').textContent = booking.customer.email;
        document.getElementById('confirmPhone').textContent = booking.customer.phone;
        
        // Notification preference
        const notificationMethod = booking.customer.newsletter ? 'Email & SMS' : 'Email only';
        document.getElementById('confirmNotification').textContent = notificationMethod;
    }
    
    // Store booking data globally for sharing functions
    window.currentBooking = booking;
}

function setupSharingFunctions() {
    // Add event listeners for sharing buttons
    document.addEventListener('click', function(e) {
        const target = e.target;
        
        if (target.onclick) {
            // Functions are already bound via onclick attributes
            return;
        }
    });
}

function setupCalendarFunctions() {
    // Setup calendar integration functions
    if (window.currentBooking) {
        generateCalendarData();
    }
}

function generateCalendarData() {
    if (!window.currentBooking) return;
    
    const booking = window.currentBooking;
    const appointmentDate = new Date(booking.appointment?.dateTime || Date.now());
    
    window.calendarEvent = {
        title: `${booking.service.name} - BookEase`,
        description: `Appointment with ${booking.provider}\nBooking ID: ${booking.bookingId}\nDuration: ${booking.service.duration}`,
        location: 'Downtown Medical Center, 123 Main St, City, ST 12345',
        startDate: appointmentDate,
        endDate: new Date(appointmentDate.getTime() + (45 * 60 * 1000)), // Add 45 minutes
        allDay: false
    };
}

// Calendar Functions
function addToGoogleCalendar() {
    if (!window.calendarEvent) {
        showNotification('Calendar data not available', 'error');
        return;
    }
    
    const event = window.calendarEvent;
    const startDate = event.startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endDate = event.endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE` +
        `&text=${encodeURIComponent(event.title)}` +
        `&dates=${startDate}/${endDate}` +
        `&details=${encodeURIComponent(event.description)}` +
        `&location=${encodeURIComponent(event.location)}`;
    
    window.open(googleUrl, '_blank');
}

function addToOutlookCalendar() {
    if (!window.calendarEvent) {
        showNotification('Calendar data not available', 'error');
        return;
    }
    
    const event = window.calendarEvent;
    const startDate = event.startDate.toISOString();
    const endDate = event.endDate.toISOString();
    
    const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?` +
        `subject=${encodeURIComponent(event.title)}` +
        `&startdt=${startDate}` +
        `&enddt=${endDate}` +
        `&body=${encodeURIComponent(event.description)}` +
        `&location=${encodeURIComponent(event.location)}`;
    
    window.open(outlookUrl, '_blank');
}

function downloadICS() {
    if (!window.calendarEvent) {
        showNotification('Calendar data not available', 'error');
        return;
    }
    
    const event = window.calendarEvent;
    const startDate = event.startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endDate = event.endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//BookEase//EN',
        'BEGIN:VEVENT',
        `UID:${window.currentBooking.bookingId}@bookease.com`,
        `DTSTART:${startDate}`,
        `DTEND:${endDate}`,
        `SUMMARY:${event.title}`,
        `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
        `LOCATION:${event.location}`,
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');
    
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `appointment-${window.currentBooking.bookingId}.ics`;
    link.click();
    
    showNotification('Calendar file downloaded successfully', 'success');
}

// Sharing Functions
function shareViaEmail() {
    if (!window.currentBooking) return;
    
    const booking = window.currentBooking;
    const subject = `Appointment Confirmation - ${booking.service.name}`;
    const body = `Hi,

I wanted to share my upcoming appointment details with you:

Service: ${booking.service.name}
Provider: ${booking.provider}
Date: ${booking.appointment.formatted.date}
Time: ${booking.appointment.formatted.time}
Duration: ${booking.service.duration}
Booking ID: ${booking.bookingId}

Location: Downtown Medical Center
Address: 123 Main St, City, ST 12345

Best regards,
${booking.customer.firstName} ${booking.customer.lastName}`;
    
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
}

function shareViaSMS() {
    if (!window.currentBooking) return;
    
    const booking = window.currentBooking;
    const message = `Appointment: ${booking.service.name} with ${booking.provider} on ${booking.appointment.formatted.date} at ${booking.appointment.formatted.time}. Booking ID: ${booking.bookingId}`;
    
    const smsUrl = `sms:?body=${encodeURIComponent(message)}`;
    window.location.href = smsUrl;
}

function copyAppointmentLink() {
    const url = window.location.href;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
            showNotification('Appointment link copied to clipboard', 'success');
        }).catch(() => {
            fallbackCopyToClipboard(url);
        });
    } else {
        fallbackCopyToClipboard(url);
    }
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification('Appointment link copied to clipboard', 'success');
    } catch (err) {
        showNotification('Failed to copy link', 'error');
    }
    
    document.body.removeChild(textArea);
}

// Utility Functions
function printConfirmation() {
    // Hide non-printable elements
    const noPrintElements = document.querySelectorAll('.no-print, .header, .mobile-nav, footer');
    noPrintElements.forEach(el => el.style.display = 'none');
    
    // Print
    window.print();
    
    // Restore elements
    noPrintElements.forEach(el => el.style.display = '');
}

function openLiveChat() {
    // Simulate opening live chat
    showNotification('Live chat would open here in a real implementation', 'info');
}

// Auto-refresh booking status (simulate real-time updates)
function startStatusUpdates() {
    setInterval(() => {
        // In a real app, this would check with the server for status updates
        updateBookingStatus();
    }, 30000); // Check every 30 seconds
}

function updateBookingStatus() {
    if (!window.currentBooking) return;
    
    // Simulate random status updates for demo
    const statuses = ['confirmed', 'reminder_sent', 'provider_assigned'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    // Update status badge if it changed
    const statusBadge = document.querySelector('.badge-secondary');
    if (statusBadge && Math.random() < 0.1) { // 10% chance of update
        statusBadge.textContent = capitalizeFirst(randomStatus.replace('_', ' '));
    }
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Initialize status updates
startStatusUpdates();

// Add print styles
const printStyles = `
<style>
@media print {
    .no-print, .header, .mobile-nav, footer,
    .btn, button, .card-header {
        display: none !important;
    }
    
    .card {
        box-shadow: none !important;
        border: 1px solid #000 !important;
        margin-bottom: 20px !important;
    }
    
    .container {
        max-width: none !important;
        padding: 0 !important;
    }
    
    body {
        background: white !important;
        color: black !important;
    }
    
    .text-primary, .text-secondary, .text-accent {
        color: black !important;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', printStyles);