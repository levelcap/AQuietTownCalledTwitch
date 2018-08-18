const mongoose = require('mongoose');

const charactersSchema = new mongoose.Schema({
  _id: String,
  name: String,
  channel: String,
  skills: {
    fight: {
      type: Number,
      default: 1,
    },
    shoot:  {
      type: Number,
      default: 1,
    },
    deduce:  {
      type: Number,
      default: 1,
    },
    guess:  {
      type: Number,
      default: 1,
    },
    charm:  {
      type: Number,
      default: 1,
    },
    scare:  {
      type: Number,
      default: 1,
    }
  },
}, {
  collection: 'characters',
  timestamps: 1,
});

module.exports = mongoose.model('characters', charactersSchema);