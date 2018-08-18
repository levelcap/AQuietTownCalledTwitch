const { set } = require('lodash');
require('dotenv').config({ silent: true });

const envConfig = {
// Define our constants, you will change these with your own
  twitch: {
    clientId: process.env.TWITCH_CLIENT_ID,
    secret: process.env.TWITCH_SECRET,
    sessionSecret: process.env.SESSION_SECRET,
    callbackUrl: process.env.CALLBACK_URL,
  },
  mongo: {
    url: process.env.MONGO_URL,
  },
};

module.exports = envConfig;
