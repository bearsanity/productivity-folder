const mongoose = require('mongoose');
const { Schema } = mongoose;

const Task = new Schema({
  title: { 
    type: String,
    required: true
  },
  notes: String,
  frequency: { 
    type: String, 
    enum: ['none', 'daily', 'weekly', 'monthly', 'yearly'],
    default: 'none' 
  },
  dueDate: { 
    type: Date, 
    required: true,
  },
  priority: { 
    type: String,
    enum: ['none', 'low', 'medium', 'high', 'top'],
    default: 'none'
  },
  userId: {
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  group: {
    type: Schema.Types.ObjectId,
    ref: 'Group'
  },
  completionHistory: {
    type: [Date]
  }

},
{ timestamps: true }
);

module.exports = mongoose.model('Task', Task);