const twilio = require('twilio');

const accountSid = require('../config/config').accountSid  || process.env.accountSid;
const authToken = require('../config/config').authToken  || process.env.authToken;
const twilioPhoneNumber = require('../config/config').twilioPhoneNumber || process.env.twilioPhoneNumber;

const client = new twilio(accountSid, authToken);

exports.sendTextMessage = (to, {title, message}) => {
  const body = `${title} - ${message}`;
  client.messages.create({
    body,
    to,
    from: twilioPhoneNumber,
  })
}