const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  established: {
    type: String,
    required: true
  },
  courses: [{
    type: String,
    trim: true
  }],
  facilities: [{
    type: String,
    trim: true
  }],
  achievements: {
    type: String,
    trim: true
  },
  contactInfo: {
    type: String,
    required: true
  },
  website: {
    type: String,
    trim: true
  },
  departments: [{
    type: String,
    trim: true
  }],
  accreditation: {
    type: String,
    trim: true
  },
  ranking: {
    type: Number
  },
  questionsCount: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const College = mongoose.model('College', collegeSchema);
module.exports = College; 