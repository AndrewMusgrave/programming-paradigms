const twilio = require('twilio');

const accountSid = process.env.accountSid || require('../config/config').accountSid;
const authToken = process.env.authToken || require('../config/config').authToken;
const twilioPhoneNumber = process.env.twilioPhoneNumber || require('../config/config').twilioPhoneNumber;

const client = new twilio(accountSid, authToken);

exports.sendTextMessage = (to, {title, message}) => {
  const body = `${title} - ${message}`;
  client.messages.create({
    body,
    to,
    from: twilioPhoneNumber,
  })
}