const _ = require('lodash');
const COMMANDS = '!commands';
const SHEET = '!sheet';
const INFO = '!info';
const MOVEIN = '!movein';
const MESSAGE_TYPES = [ COMMANDS, SHEET, INFO, MOVEIN ];

let client = null;

const runCommands = (channel) => {
  client.say(channel, 'Available commands: !info, !sheet');
};

const runSheet = (channel, username) => {
  client.say(channel, `${username} has a strength of 10 and a face of Ugly`);
};

const runInfo = (channel) => {
  client.say(channel, 'AQuietTownCalledTwitch is a text based adventure game, I guess!');
};

module.exports = (tmiClient) => {
  client = tmiClient;
  const characterHandler = require('./characterHandler')(client);

  return {
    handleMessage: (channel, userstate, message) => {
      const username = userstate['username'];
      const userId = userstate['user-id'];

      if (_.includes(MESSAGE_TYPES, message)) {
        switch (message) {
          case COMMANDS:
            runCommands(channel);
            break;
          case SHEET:
            runSheet(channel, username);
            break;
          case INFO:
            runInfo(channel);
            break;
          case MOVEIN:
            characterHandler.runMoveIn(channel, username, userId);
            break;
          default:
            console.log(`No handler for command ${message}`);
        }
      } else {
        console.log('I dont know how to handle that message');
      }
    }
  }
};