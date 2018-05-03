const PhoneNumber = require('../models/phone_number');
const twilio = require('twilio');

const accountSid = process.env.accountSid || require('../config/config').accountSid;
const authToken = process.env.authToken || require('../config/config').authToken;
const twilioPhoneNumber = process.env.twilioPhoneNumber || require('../config/config').twilioPhoneNumber;

const sendersPhoneNumber = process.env.sendersPhoneNumber || require('../config/config').sendersPhoneNumber;

const client = new twilio(accountSid, authToken);

const ADD = 'ADD';
const DELETE = 'DELETE';
const MESSAGE = 'MESSAGE';
const MESSAGE_ALL = 'MESSAGE_ALL';

function sendTextMessage(to, {title, message}) {
    const body = `${title ? title + ' - ' : ''}${message}`;
    client.messages.create({
      body,
      to,
      from: twilioPhoneNumber,
    })
    .catch(error => onTextMessageError(to, error))
}

async function sendTextMessages(title, message) {
  let returnMessage = '';
  await PhoneNumber.find()
    .then(response => {
      response.map(({phoneNumber}) => {
        sendTextMessage(phoneNumber, {title, message});
      })
      returnMessage = {success: 'Messages send'};
    })
    .catch(error => {
      sendTextMessage(sendersPhoneNumber, {title: 'Error', message: error.Payload})
      returnMessage = {error: error};
    });

    return returnMessage;
}

function onTextMessageError(phoneNumber, error) {
  const {code} = error;

  if (code === 11000) {
    client.messages.create({
      body: 'Error: This phone number has already signed up for sms notifications. If this was a mistake please text "cancel"',
      to: phoneNumber,
      from: twilioPhoneNumber,
    })
    return {error: `Duplicate phone number`}
  }

  if (code == 21610) {
    deletePhoneNumber(phoneNumber);
    client.messages.create({
      body: `Removing ${phoneNumber}`,
      to: sendersPhoneNumber,
      from: twilioPhoneNumber,
    })
    return {error: 'Blacklisted user'};
  }

  if (code == 21211) {
    deletePhoneNumber(phoneNumber);
    return {error: 'Removed invalid phone number'};
  }

  return {error: 'Untracked error'};
}

function onErrorHook(error) {
  sendTextMessage(sendersPhoneNumber, {title: 'Error', message: error.Payload});
}

function onTextHook(Body, From) {
  const authPhoneNumber = `+1${sendersPhoneNumber}`;
  if (From !== authPhoneNumber) {
    return;
  }

  const {command, phoneNumber, message} = parseTextMessageBody(Body);
  switch(command) {
    case ADD:
      if (phoneNumber) {
        addPhoneNumber(phoneNumber);
      }
      break;
    case DELETE:
      if (phoneNumber) {
        deletePhoneNumber(phoneNumber);
      }
      break;
    case MESSAGE:
      if (phoneNumber) {
        sendTextMessage(phoneNumber, {message});
      }
      break;
    case MESSAGE_ALL:
      sendTextMessages('', message);
      break;
    default:
      break;
  }
  sendTextMessage(sendersPhoneNumber, {title: From, message: Body});
}

async function deletePhoneNumber(phoneNumber) {
  let message = '';
  const cleanPhoneNumber = phoneNumber.replace(/\D/g, '')
  await PhoneNumber.findOneAndRemove({phoneNumber})
    .then(response => {
      if (response) {
        sendTextMessage(sendersPhoneNumber, {message: `Removing: ${phoneNumber}`});
        message = {success: `Removed: ${phoneNumber}`}
      } else {
        message = {success: `Unable to remove phone number because it does not exist in database: ${phoneNumber}`}
      }
    })
    .catch(error => {
      message = {error: `Error removing ${phoneNumber} from list`}
    });

    return message;
}

async function addPhoneNumber(phoneNumber) {
  let message = '';
  const cleanPhoneNumber = phoneNumber.replace(/\D/g, '')
  const userPhoneNumber = new PhoneNumber({phoneNumber: cleanPhoneNumber});
  await userPhoneNumber.save()
    .then(response => {
      sendTextMessage(
        phoneNumber,
        {
          message: 'Thank you for signing up to programming paradigms sms notification service. Please text "cancel" to remove yourself from the notifcation list'
        }
      )

      message = response;
    })
    .catch(error => {
      message = onTextMessageError(phoneNumber, error);
    });

  return message;
}

function parseTextMessageBody(body) {
  const seperateIndex = body.indexOf(':');
  const commandChunk = body.slice(0, seperateIndex);
  const commandParsed = commandChunk.split('-');

  const message = body.slice(seperateIndex + 2);
  let command = '';
  let phoneNumber = null;
  if (commandParsed.length === 2) {
    command = commandParsed[0];
    phoneNumber = commandParsed[1];
  } else {
    command = commandParsed;
  }

  return {
    command,
    phoneNumber,
    message,
  }
}

exports.sendTextMessage = sendTextMessage;
exports.sendTextMessages = sendTextMessages;
exports.onTextMessageError = onTextMessageError;
exports.onErrorHook = onErrorHook;
exports.onTextHook = onTextHook;
exports.deletePhoneNumber = deletePhoneNumber;
exports.addPhoneNumber = addPhoneNumber;