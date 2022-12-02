const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const quantitySchema = new Schema({
    quantity: Number
});

module.exports = mongoose.model('Quantity', quantitySchema);