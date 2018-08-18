const _ = require('lodash');
const Users = require('../models/characters');

module.exports = (client) => {
  return {
    runMoveIn: (channel, username, userId) => {
      const _id = `${userId}-${channel}`;

      Users.findOne({ _id }, (findErr, user) => {
        if (findErr) {
          console.log(`Error finding user ${id}: ${findErr}`);
          return;
        }

        if (!user) {
          const newUser = new Users({
            _id,
            channel,
          });

          newUser.save((saveErr) => {
            if (saveErr) {
              console.log(`Error saving new user ${id}: ${saveErr}`);
            }
            client.say(channel, `Welcome to the town of Twitch, ${username}!`);
          });
        } else {
          client.say(channel, `${username} already lives in the town of Twitch`);
        }
      });
    },
  }
};