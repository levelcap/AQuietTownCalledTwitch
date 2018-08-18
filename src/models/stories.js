const mongoose = require('mongoose');

const storiesSchema = new mongoose.Schema({
  _id: String,
  channel: String,
  currentChapter: Number,
  chapters: [
    {
      number: Number,
      title: String,
      intro: String,
      characters: [ String ],
    },
  ],
}, {
  collection: 'stories',
  timestamps: 1,
});

module.exports = mongoose.model('stories', storiesSchema);