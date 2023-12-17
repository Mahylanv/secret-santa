const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
    email: {
        type: String,
        required: true, 
        unique: true, // qu'un seul email possible
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'user', // par defaut il est user
    },
    groups: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
    }],
});


module.exports = mongoose.model('User', userSchema);