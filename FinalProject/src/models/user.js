let mongoose = require('mongoose')
let validator = require('validator')
// https://www.npmjs.com/package/validator

let userSchema = new mongoose.Schema({
  name: {type: String, required: [true, 'Name is required']},
  avatar: { data: Buffer, contentType: String },
  username: {type: String, required: [true, 'Username is required']},
  password: {type: String, required: [true, 'Password is required']},
  role: {type: String, required: [true, 'Cargo es requerido']}
});

module.exports = mongoose.model('User', userSchema);