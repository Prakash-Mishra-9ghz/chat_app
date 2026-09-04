const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['public', 'private'],
        default: 'public'
    },
    passwordHash: {
        type: String,
        default: null,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    memberIds: [
            {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    lastMessageAt: {
        type: Date
    }
},{
    timestamps: true
})

module.exports = mongoose.model('Room', roomSchema);
