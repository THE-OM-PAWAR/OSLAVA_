 //                        MODULE                           //
//=========== defining schema for adding user =============//

const bcrypt = require("bcryptjs/dist/bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

//============= connecting MongoDB ============//
var OslavaDataBase = mongoose.createConnection(
  "mongodb://0.0.0.0/OSLAVA",
  { useNewUrlParser: true,
    // useCreateIndex: true, 
    autoIndex: true,  }
);
  const users_schema =  new mongoose.Schema({
  communityName: {type : String , required : true , unique : true},
  presidentName: String,
  VicePresidentName: String,
  SecretaryName: String,
  members: Number,

  clubDescription: {
    type: String,
    required: true,
  },
  officialEmail: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: Number,
    required: true,
  },

  joinedMember:[{
    type: mongoose.Schema.Types.ObjectId,
    ref : "Users"
  }],
  joinedVolunteer:[{
    type: mongoose.Schema.Types.ObjectId,
    ref : "Users"
  }],
  communityProfile : String ,
  ragistrationDate : Date,
})


var Communities = OslavaDataBase.model("Communities", users_schema);

//======= Exportin Collection Here =======//
module.exports = { Communities };
