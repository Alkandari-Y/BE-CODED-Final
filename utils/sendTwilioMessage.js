require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

const client = require('twilio')(accountSid, authToken);

exports.sendTwilioSMSMessage = (userPhoneNumber, SMSToken) => {
    client.messages
  .create({
     body: `PLease enter the following numbers to finalize your registration: \n${SMSToken}`,
     from: `${twilioNumber}`,
     to: `${userPhoneNumber}`
   })
  .then(message => console.log(message));
}