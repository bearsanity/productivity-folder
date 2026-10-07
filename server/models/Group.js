const mongoose = require('mongoose');
const { Schema } = mongoose;


const Group = new Schema({
  title: { 
    type: String,
    required: true
  },
  color: { 
    type: String,
    default: null
  },
  userId: {
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  }
},
{ timestamps: true }
);

module.exports = mongoose.model('Group', Group);