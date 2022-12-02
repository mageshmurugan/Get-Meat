const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressSchema = new Schema({
    firstName: {
        required: true,
        type: String
    },
    lastName: {
        required: true,
        type: String
    },
    address: {
        required: true,
        type: String
    },
    city: {
        required: true,
        type: String
    },
    zipCode: {
        required: true,
        type: String
    },
    state: {
        required: true,
        type: String
    },
    landMark: {
        // required: true,
        type: String
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Address', addressSchema);
