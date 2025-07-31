const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile: String,
  imageUrl: String,
});

module.exports = mongoose.model('Profile', profileSchema);
