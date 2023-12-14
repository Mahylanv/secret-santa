const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let groupSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    members: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }],
    inviteTokens: [{
        token: String,
        expiresAt: Date
    }]
});

module.exports = mongoose.model('Group', groupSchema);
