const PhoneNumber = require('../models/phone_number');
const sendTextMessage = process.env.sendTextMessage || require('../services/twilio').sendTextMessage;
const sendersPhoneNumber = process.env.sendersPhoneNumber || require('../config/config').sendersPhoneNumber;

module.exports = {
  sendMessage(req, res, next) {
    const {title, message} = req.body;
    PhoneNumber.find()
      .then(response => {
        response.map(({phoneNumber}) => {
          sendTextMessage(phoneNumber, {title, message});
        })
        res.status(200).send({success: 'Messages send'})
      })
      .catch(error => {
        sendTextMessage(sendersPhoneNumber, {title: 'Error', message: error})
        res.status(500).send({error: error});
      });
  },

  addPhoneNumber(req, res, next) {
    const {phoneNumber} = req.body;
    const cleanPhoneNumber = phoneNumber.replace(/\D/g, '')
    const userPhoneNumber = new PhoneNumber({phoneNumber: cleanPhoneNumber});
    userPhoneNumber.save()
      .then(response => {
        sendTextMessage(phoneNumber, {message: 'Thank you for signing up to programming paradigms sms notification service. Please text "cancel" to remove yourself from the notifcation list'})
        res.send(response)
      })
      .catch(error => {
        let message;
        if (error.code === 11000) {
          message = "Duplicate phone number"
          sendTextMessage(phoneNumber, {title: 'Error', message: 'This phone number has already signed up for sms notifications. If this was a mistake please text "cancel"'})
        }
        res.status(500).send({error: message} || error)
      });
  },

  deletePhoneNumber(req, res, next) {
    const {phonenumber: phoneNumber = ''} = req.headers;
    const cleanPhoneNumber = phoneNumber.replace(/\D/g, '')
    PhoneNumber.findOneAndRemove({phoneNumber})
      .then(response => {
        sendTextMessage(phoneNumber, {message: 'This phone number has been removed from the notification list'})
        res.send(response);
      })
      .catch(error => {
        sendTextMessage(sendersPhoneNumber, {title: 'Error', message: `Removing ${phoneNumber}`});
        sendTextMessage(phoneNumber, {message: 'An error has occured trying to remove your phone number. The owner has been notified and will remove it manually'});
      });
  },

  receiveTextMessage(req, res, next) {
    const {Body = '', From} = req.body;
    sendTextMessage(sendersPhoneNumber, {title: From, message: Body});
    res.send(`
      <Response></Response>
    `);
  },

  onErrorHook(req, res, next) {
    console.log(req.body);
    res.send(`
      <Response></Response>
    `);
  }
}