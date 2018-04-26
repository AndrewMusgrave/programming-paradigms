const PhoneNumber = require('../models/phone_number');
const sendTextMessage = process.env.sendTextMessage || require('../services/twilio').sendTextMessage;
const sendersPhoneNumber = process.env.sendersPhoneNumber || require('../config/config').sendersPhoneNumber;

const sendTextMessages = require('../services/twilio').sendTextMessages;
const addPhoneNumber = require('../services/twilio').addPhoneNumber;
const deletePhoneNumber = require('../services/twilio').deletePhoneNumber;
const onTextHook = require('../services/twilio').onTextHook;
const onErrorHook = require('../services/twilio').onErrorHook;

module.exports = {
  async sendMessage(req, res, next) {
    const {title, message} = req.body;
    const response = await sendTextMessages(title, message);
    res.send(response);
  },

  async addPhoneNumber(req, res, next) {
    const {phoneNumber} = req.body;
    const response = await addPhoneNumber(phoneNumber);
    res.send(response);
  },

  async deletePhoneNumber(req, res, next) {
    const {phonenumber: phoneNumber = ''} = req.headers;
    const response = await deletePhoneNumber(phoneNumber);
    res.send(response);
  },

  receiveTextMessage(req, res, next) {
    const {Body = '', From} = req.body;
    onTextHook(Body, From);
    res.send(`
      <Response></Response>
    `);
  },

  onErrorHook(req, res, next) {
    onErrorHook(req.body);
    res.send(`
      <Response></Response>
    `);
  }
}