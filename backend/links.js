const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure 
const Links = new Schema(
  {
    link: String,
    source: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("links", Links);