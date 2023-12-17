const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let groupSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    members: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        joinedAt: {
            type: Date,
            default: Date.now,
        },
    }],
    inviteTokens: [{
        token: {
            type: String
        },
        email: {
            type: String,
            required: true,  // Ajout de cette ligne si l'e-mail doit être obligatoire
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        expiresAt: Date,
    }],
});

module.exports = mongoose.model('Group', groupSchema);