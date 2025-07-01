const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Service title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Service description is required'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Service price is required'],
    min: [0, 'Price cannot be negative']
  },
  duration: {
    type: Number,
    required: [true, 'Service duration is required'],
    min: [15, 'Duration must be at least 15 minutes']
  },
  category: {
    type: String,
    required: [true, 'Service category is required'],
    enum: [
      'healthcare',
      'beauty',
      'consulting',
      'education',
      'fitness',
      'legal',
      'technology',
      'other'
    ]
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  images: [{
    type: String
  }],
  availability: {
    monday: {
      enabled: { type: Boolean, default: true },
      slots: [{
        start: String,
        end: String
      }]
    },
    tuesday: {
      enabled: { type: Boolean, default: true },
      slots: [{
        start: String,
        end: String
      }]
    },
    wednesday: {
      enabled: { type: Boolean, default: true },
      slots: [{
        start: String,
        end: String
      }]
    },
    thursday: {
      enabled: { type: Boolean, default: true },
      slots: [{
        start: String,
        end: String
      }]
    },
    friday: {
      enabled: { type: Boolean, default: true },
      slots: [{
        start: String,
        end: String
      }]
    },
    saturday: {
      enabled: { type: Boolean, default: false },
      slots: [{
        start: String,
        end: String
      }]
    },
    sunday: {
      enabled: { type: Boolean, default: false },
      slots: [{
        start: String,
        end: String
      }]
    }
  },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better search performance
serviceSchema.index({ title: 'text', description: 'text' });
serviceSchema.index({ category: 1, price: 1 });
serviceSchema.index({ provider: 1 });

module.exports = mongoose.model('Service', serviceSchema);