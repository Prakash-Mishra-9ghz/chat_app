const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true
    },
    passwordHash: {
        type: String,
        required: [true, 'Password is required'],
        select: false
    },
    avatarUrl: {
        type: String
    },
    status: {
        type: String,
        default: "Offline"
    },
    lastSeen: {
        type: Date
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('User', userSchema);
