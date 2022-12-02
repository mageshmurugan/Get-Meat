// const { Schema, model } = require("mongoose");
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');


const OtpcpSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true,

    },
    createAt: { type: Date, default: Date.now, index: { expires: 3000 } }
}, { timestamps: true })
// OtpSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Otpcp', OtpcpSchema);


