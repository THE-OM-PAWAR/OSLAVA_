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
  userName: String,
  userMobile: {
    type: Number,
    required: true,
    unique: true,
  },
  userPassward: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  communities:[{
    type: mongoose.Schema.Types.ObjectId,
    ref : "Communities"
  }],
  tokens : [{
    token: {
      type: String,
      required: true,
      unique: true,
    },
  }],
  profileImg : String ,
  userPosition :String,
  signUpDate : Date,
  loginStatus : Boolean,
})

 //                MIDDLEWARE                   //
//============ generating token ===============//
users_schema.methods.generateAuthToken = async function (){
  try {
    const token = jwt.sign({ _id: this._id }, process.env.SECRET_TOKEN_KEY)
    console.log("token saved 40") 
      this.tokens = this.tokens.concat({token : token})
      console.log("token saved 40")
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


var users = OslavaDataBase.model("Users", users_schema);

//======= Exportin Collection Here =======//
module.exports = { users };
