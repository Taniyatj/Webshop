const mongoose = require("mongoose");
const bcrypt = require ("bcrypt");
const res = require("express/lib/response");

const userSchema = new mongoose.Schema({
  userN : {type: "string", required: "true", unique: "true"},
  adrs1 : {type: "string", required: "true"},
  adrs2 : {type: "string", required: "true"},
  eml : {type: "string", required: "true", unique: "true"},
  psw : {type: "string", required: "true"},
  cpsw : {type: "string", required: "true"}
})


userSchema.pre("save", async function(next) {

  if(this.isModified("psw")){

    this.psw = await bcrypt.hash(this.psw, 10);


    this.cpsw = undefined;

  }
  
  next();
})

const User = new mongoose.model("User", userSchema);


module.exports = User;

