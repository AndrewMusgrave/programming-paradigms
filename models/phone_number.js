const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const phoneNumberSchema = new Schema({
  phoneNumber: {
    type: String,
    unique: true,
  },
})

const PhoneNumber = mongoose.model('phoneNumber', phoneNumberSchema);

module.exports = PhoneNumber;