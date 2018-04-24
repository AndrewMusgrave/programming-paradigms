const PhoneNumber = require('../models/phone_number');
const twilio = require('twilio');

const accountSid = process.env.accountSid || require('../config/config').accountSid;
const authToken = process.env.authToken || require('../config/config').authToken;
const twilioPhoneNumber = process.env.twilioPhoneNumber || require('../config/config').twilioPhoneNumber;

const sendersPhoneNumber = process.env.sendersPhoneNumber || require('../config/config').sendersPhoneNumber;

const client = new twilio(accountSid, authToken);

exports.sendTextMessage = (to, {title, message}) => {
  const body = `${title ? title + ' - ' : ''}${message}`;
  client.messages.create({
    body,
    to,
    from: twilioPhoneNumber,
  })
  .catch(err => {
    const {code} = err;
    if (code == 21610) {
      deletePhoneNumber(to);
    }
  })
}

function deletePhoneNumber(phoneNumber) {
  const cleanPhoneNumber = phoneNumber.replace(/\D/g, '')
  PhoneNumber.findOneAndRemove({phoneNumber})
    .then(response => {
      client.messages.create({
        body: `Removed: ${phoneNumber}`,
        to: sendersPhoneNumber,
        from: twilioPhoneNumber,
      })
      res.send(response);
    })
    .catch(error => {
      client.messages.create({
        body: `Error - Removing ${phoneNumber}: ${error}`,
        to: sendersPhoneNumber,
        from: twilioPhoneNumber,
      })
    });
}

exports.sendMessages = (body) => {
  PhoneNumber.find()
    .then(response => {
      response.map(({phoneNumber}) => {
        client.messages.create({
          body,
          to: phoneNumber,
          from: twilioPhoneNumber,
        })
      })
    })
    .catch(error => {
      client.messages.create({
        body: `Error - Sending message to ${phoneNumber}: ${error}`,
        to: sendersPhoneNumber,
        from: twilioPhoneNumber,
      })
    });
}
