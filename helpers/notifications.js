/**
 * Title: Twilio notification
 * Description: By twilio notification, We can send message to user phone.
 * Author: Md Mohiuddin
 * Date: 07/08/2022
 */

// dependencies
const querystring = require("querystring");
const https = require("https");
const { twilio } = require("../helpers/environments");

// module scaffloding
const notifications = {};

notifications.sendTwilioSms = (phone, msg, cb) => {
  const userPhone =
    typeof phone === "string" && phone.trim().length === 11
      ? phone.trim()
      : false;
  const userMsg =
    typeof msg === "string" && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() : false;

  if (userPhone && userMsg) {
    // configure the request payload
    const payload = {
      From: twilio.fromPhone,
      To: `+88${userPhone}`,
      Body: userMsg,
    };

    // stringify the payload
    const stringifyPayload = querystring.stringify(payload);

    // configure the request details
    const requestDetails = {
      hostname: "api.twilio.com",
      method: "POST",
      path: `/2010-04-01/Accounts/${twilio.accountSID}/Messages.json`,
      auth: `${twilio.accountSID}:${twilio.authToken}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    // initiate the request object
    const req = https.request(requestDetails, (res) => {
      // get the status of the send request
      const status = res.statusCode;
      // callback successfully if the request went through
      if (status === 200 || status === 201) {
        cb(false);
      } else {
        cb(`Status code returned was ${status}`);
      }
    });

    req.on("error", (e) => {
      console.log(e);
    });

    req.write(stringifyPayload);
    req.end();
  } else {
    cb("Giving perameters were missing or invalid!");
  }
};

module.exports = notifications;
