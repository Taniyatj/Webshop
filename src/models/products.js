const mongoose = require("mongoose");
const res = require("express/lib/response");

const productSchema = new mongoose.Schema({
  productN : {type: "string", required: "true", unique: "true"},
  anzahl : {type: "number", required: "true"},
  beschr : {type: "string"},
  price : {type: "string", required: "true"},
  img:
  {
      data: Buffer,
      contentType: String
  }
})

const Product = new mongoose.model("Product", productSchema);

module.exports = Product;

