const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  thumbName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  dateAdded: {
    type: Date,
    default: Date.now
  },
  downloadCount: Number
});

module.exports = mongoose.model('Image', imageSchema);