const mongoose = require("mongoose");
const Schema = mongoose.Schema;


//define the schema (structure of article)
const articleSchema = new Schema({
  userNameee:String
})


// create modal based on the schema 

const Mydata = mongoose.model("Mydata",articleSchema);

//export the modal 

module.exports = Mydata;