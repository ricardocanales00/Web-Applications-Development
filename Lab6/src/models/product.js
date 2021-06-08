let mongoose = require('mongoose')
let validator = require('validator')
// https://www.npmjs.com/package/validator

let productSchema = new mongoose.Schema({
  name: {type: String, required: [true, 'Name is required']},
  price: { type: Number, min: 0, required: [true, 'Price is required']},
  brand: String,
});

module.exports = mongoose.model('Product', productSchema);