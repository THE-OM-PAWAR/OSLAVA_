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
  communityName: String,
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

 //                MIDDLEWARE                   //
//============ generating token ===============//
users_schema.methods.generateAuthToken = async function (){
  try {
      const token = jwt.sign({ _id: this._id }, process.env.SECRET_TOKEN_KEY)
      this.tokens = this.tokens.concat({token : token})
      await this.save();
      console.log("token saved 40")
    return token
  } catch (error) {
    res.send("the error is  =>    " + error) 
    console.log("the error is  =>    " + error) 
  }
}

 //                    MIDDLEWARE                         //
//============ converting passward into hash =============//
users_schema.pre('save' , async function(next){
  if (this.isModified("userPassward")) {
     this.userPassward = await bcrypt.hash(this.userPassward , 10)
    next()
  }
} )


var Communities = OslavaDataBase.model("Communities", users_schema);

//======= Exportin Collection Here =======//
module.exports = { Communities };
