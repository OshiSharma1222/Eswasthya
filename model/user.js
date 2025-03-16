const mongoose = require('mongoose');

// Define the User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // Name is required
        trim: true, // Removes extra spaces
    },
    email: {
        type: String,
        required: true, // Email is required
        unique: true, // Ensures email is unique
        trim: true,
        lowercase: true, // Converts email to lowercase
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'], // Validates email format
    },
    password: {
        type: String,
        required: true, // Password is required
        minlength: 6, // Minimum password length
    },
}, {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
});

// Create the User Model
const User = mongoose.model('User', userSchema);

// Export the User Model
module.exports = User;
