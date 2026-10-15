const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const User = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
},
{ timestamps: true }
);

User.pre('save', async function(next) {
  try {
    // Check if the password has been modified
    if (!this.isModified('password')) return next();
    
    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
    next(); // Proceed to save
  } catch (error) {
    next(error); // Pass any errors to the next middleware
  }
});

User.methods.isValidPassword = async function(password) {
  try {
    // Compare provided password with stored hash
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error('Password does not match!');
  }
};

module.exports = mongoose.model('User', User);