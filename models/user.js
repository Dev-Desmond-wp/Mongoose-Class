const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Suspended', 'Deleted', 'Inavctive'],
        default: 'Inavctive'
    },
    isVerified: {
        type: String,
        defualt: false
    },
    otp: {
        type: String
    }
}, {
    timestamps: true
});

const userModel = mongoose.model('Users', userSchema);

module.exports = userModel