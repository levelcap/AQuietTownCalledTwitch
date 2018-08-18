const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

exports.connect = (url, callback) => {
  mongoose.connect(url, callback);
};

exports.disconnect = (callback) => {
  mongoose.disconnect(callback);
};
