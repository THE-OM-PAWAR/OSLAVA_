//============= Require Module are here ============//
require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const path = require("path");
const cors = require("cors");
const multer = require("multer");
const cookie = require("cookie");
const bodyparser = require("body-parser");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs/dist/bcrypt");
const port = 8000;
const fs = require("fs");

const io = require("socket.io")(http, {
  cookie: true,
});

//============= middleware ============//
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cookieParser());

// ============declearing module=========//
const { users } = require("./modules/schemas/User_Module");
const { Communities } = require("./modules/schemas/community");

const home_auth = require("./modules/authentication/homeAuth");
const data_serving = require("./modules/authentication/user_data _server");
const authentication_logout = require("./modules/authentication/authentication_logout");
const authentication = require("./modules/authentication/authentication");

//============= Static file  ============//
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: false }));

//============= Storage For Image ============//

//============= Storage For Image ============//
var CommunityProfile = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/CommunityProfiles");
    console.log(file);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + Math.floor(Math.random() * 1000) + file.originalname);
    ``;
  },
});
let uploads2 = multer({ storage: CommunityProfile });
var communityProfileUpload = uploads2.fields([{ name: "CommunityProfile" }]);
var eventProfileUpload = uploads2.fields([{ name: "eventBanner" }]);



app.get("/", home_auth, (req, res) => {
  console.log("ompawar");
  try {
    if (req.user) {
      res.sendFile(__dirname + "/public/index3.html");
    } else {
      res.sendFile(__dirname + "/public/index2.html");
    }
  } catch (error) {
    res.sendFile(__dirname + "/public/index3.html");
  }
});

app.get("/createCommunity", authentication,  async (req, res) => {
  res.sendFile(__dirname + "/public/forms/createCommunity.html");
});
app.get("/MyCommunity", authentication,  async (req, res) => {
  res.sendFile(__dirname + "/public/html/mycommunities.html");
});
app.post("/createCommunity", authentication, communityProfileUpload,  async (req, res) => {
  console.log(req.files)
  console.log(req.body)

  
  let src;
  if (!req.files.CommunityProfile) {
    console.log(req.files, 45);
    src = "default.svg";
  } else {
    src = req.files.CommunityProfile[0].filename;
  }
  console.log(src)

    const userId = req.user._id;
    const {
      communityName,
      description,
      officialEmail,
      contactNumber,
      PresidentName,
      vicePresidentName,
      SeceretaryName,
      Members
    } = req.body;

    // Convert `Members` to a number
    let members 
    if (Members == NaN) {
     members = 0 
    }
   members = parseInt(Members, 10);

    // Creating a new instance of the Communities model
    const newCommunity = new Communities({
      communityName,
      clubDescription: description,
      officialEmail,
      contactNumber : parseInt(contactNumber),
      presidentName: PresidentName,
      VicePresidentName: vicePresidentName,
      SecretaryName: SeceretaryName,
      members: 20,
      communityProfile: src,
      ragistrationDate: new Date() // Automatically set the current date
    });

    console.log(newCommunity)

    await newCommunity.save().then(async ()=>{



      const updatedCommunity = await Communities.findByIdAndUpdate(
        newCommunity._id,
        { $addToSet: { joinedMember: userId } }, // $addToSet avoids duplicate entries
        { new: true } // Return the updated document
      );

      const updatedUser = await users.findByIdAndUpdate(
        userId,
        { $push: { communities: newCommunity._id } }, // $push adds the userId to the joinedMember array
        { new: true } // Return the updated document
      );


      if (!updatedCommunity) {
        return res.status(404).json({ error: "Community not found" });
      }else{
        res.status(200).redirect("/community?_id="+newCommunity._id);
      }
    });
    


});
app.get("/signUp", async (req, res) => {
  res.sendFile(__dirname + "/public/forms/signup.html");
});

let token_id;
app.get("/community", async (req, res) => {
  console.log("ompawar")
  console.log(req.query)
  token_id = req.query;
  
  res.sendFile(__dirname + "/public/html/clubprofile.html");
});

app.post("/signUp", async (req, res) => {
  try {
    if (req.body.password == req.body.confirmPassword) {
      console.log(req.body);
        const user_info = await users.find({ userMobile: req.body.mobileNumber });
        // console.log(user_info[0])
        let exist = undefined;
        if (user_info[0] !== undefined) {
          if (user_info[0].userMobile == req.body.mobileNumber) {
            exist = true;
          }
          console.log(3);
        }
        if (exist == true) {
          res.status(400).send("this mobile exist so login please ");
          return;
        }
        if (exist == undefined) {
          var mydata = new users({
            userName: req.body.UserName,
            userMobile: req.body.mobileNumber,
            userEmail: req.body.email,
            userPassward: req.body.password,
            sign_up_date: Date(Date.now()),
          });
          const token = await mydata.generateAuthToken();
          // console.log(token);
          console.log("omp 196");

          res.cookie("jwt_user", token, {
            expires: new Date(Date.now() + 1000 * 60 * 60 * 3),
            httpOnly: true,
            // secure:true
          });

          await mydata
            .save()
            .then((e) => {
              res.status(201).redirect("/");
            })
            .catch((error) => {
              res.status(400).send("not saveed 210" + error);
            });
        }
    } else {
      res.status(400).send("invalid details");
    }
  } catch (error) {
    res.status(400).send("not saveed 216" + error);
  }
});

let IdObject;
app.get("/renderThisEvent" , (req, res) => {
  IdObject = req.query;
  res.sendFile(__dirname + "/public/html/eventdashboard.html");
});

let communitiesId;
app.get("/createEvent" , authentication , (req, res) => {
  communitiesId = req.query;
  res.sendFile(__dirname + "/public/forms/createevent.html");
});

app.post("/createEvent" , authentication , eventProfileUpload , async(req, res) => {
  if (communitiesId && communitiesId.community_Id) {
    if (req.user.communities.includes(communitiesId.community_Id)) {
      console.log(req.body)
      console.log(req.user)

      try {
        // Use findByIdAndUpdate to find the document and push the new event
        let newEvent = {
          communityId : communitiesId.community_Id,
          eventName : req.body.eventName,
          eventDescription : req.body.eventDescription,
          location : req.files.eventLocation ,
          eventBanner : req.files.eventBanner[0].filename,
          creationDate : new Date(),
          eventStatus : "live",
        }
        const result = await Communities.findByIdAndUpdate(
          communitiesId.community_Id,               // ID of the community document
          { $push: { events: newEvent } },  // Push new event to events array
          { new: true, useFindAndModify: false }  // Options: return the updated document
        );
    
        console.log("Updated Community:", result);
        res.redirect("/community?_id="+ communitiesId.community_Id)
        return result;

      } catch (error) {
        console.error("Error adding event:", error);
        throw error;
      }
    }
  }else{
    res.send("internal server error try again")
  }
});

app.get("/logIn", (req, res) => {
  res.sendFile(__dirname + "/public/forms/login.html");
});

app.post("/logIn", async (req, res) => {
  try {
    console.log(req.body)
    const usrename_mobile_no = parseInt(req.body.mobileNumber);
    const password = req.body.password;
    const user_info = await users.findOne({ userMobile: usrename_mobile_no });
    console.log(user_info)
    const isMatch = await bcrypt.compare(password, user_info.userPassward);
    console.log(241 + await bcrypt.compare(password , user_info.userPassward))

    if (isMatch) {
      const token = await user_info.generateAuthToken();

      res.cookie("jwt_user", token, {
        expires: new Date(Date.now() + 36000000),
        httpOnlysd: true,
        // secure:true
      });
      user_info.loginStatus = true;
      res.status(201).redirect("/");
    } else {
      res.send("passward not matching");
    }
  } catch (error) {
    // res.status(400).sendFile(__dirname + "/public/login.html");
    res.send(error);
  }
});


app.get("/m_data", data_serving, (req, res) => {
  let user = req.user;
  let position = user.user_position;
  if (position === "volunteer") {
      res.status(200).json({ position: position });
  } else {
      res.status(200).json({ position: "user" });
  }
});


//============= logoutAll pages are here ============//
app.get("/logoutAll", authentication_logout, async (req, res) => {
    try {
      req.user.tokens = [];
  
      res.clearCookie("jwt_user");
      console.log("logout succesfully");
  
      await req.user.save();
      res.status(201).json({
        position: "modal6",
        method: "get",
        headers: {
          "content-type": "application/json",
        },
        body: {
          modal_html: `
              <div class="modal_wrapper no ">
                  <div class="modal_container">
                  <h2 class="modal_h2" >you have succesfully Logout</h2>
                      <p class="text">you have succesfully logout from all devices and your account data is securly saved. <br> login for getting your account and All Data</p>
                      <div class="action">
                          <a href="/" ><button class="btn_purple">Confirm</button></a>
                          </div>
                          </div>
              </div>`,
        },
      });
    } catch (error) {
      res.send(500).send(error);
    }
  });
  
//============= Server Listning here ============//
http.listen(port, "0.0.0.0", () => {
  console.log(`the app is runing at port http://localhost:${port}`);
});


io.on("connection", async (socket) => {
  console.log("Connected...");

  socket.on("confirm", () => {
    console.log("user connectiion confirm...");
  });
  socket.on("give-my-communites" , async()=>{

    const token_obj = cookie.parse(socket.handshake.headers.cookie);
    const token = token_obj.jwt_user;
    const verifyUser = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
    const user = await users.findOne({ _id: verifyUser._id });

    console.log(user.communities)
     user.communities.forEach(async element =>{
      let communities = await Communities.find({_id : element})
      socket.emit("take-my-communites" , communities[0])
    })
  })


  socket.on("give-communites" , async()=>{
    let communities = await Communities.find({})
    socket.emit("render-communites" , communities)
  })


  socket.on("give-all-events" , async()=>{
    let communities = await Communities.find({})

    let events = []
    communities.forEach(element=>{
      socket.emit("take-events" , element.events , element)
    })

    console.log(events)
    socket.emit("take-all-events")
  })


  socket.on("give-event-data" , async()=>{

    const token_obj = cookie.parse(socket.handshake.headers.cookie);
    const token = token_obj.jwt_user;
    if (token !== undefined) {
      const verifyUser = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
      const user = await users.findOne({ _id: verifyUser._id });
      
      if (IdObject) {
        let owner;
        user.communities.forEach(async element =>{
          if (element == IdObject.communityId) {
            owner = true
          }
        })
        console.log(owner)
        let community = await Communities.findOne({_id : IdObject.communityId})
        
        community.events.forEach(element => {
          if (element._id == IdObject._id) {
            socket.emit("take-this-event-data" , element , community , owner)
          }
        });
      }
    }else{
      let community = await Communities.findOne({_id : IdObject.communityId})
        community.events.forEach(element => {
          if (element._id == IdObject._id) {
            socket.emit("take-this-event-data" , element , community )
          }
        });
    }
      
  })
  // giving menu here
  socket.on("menu-please", async (info) => {
    console.log(info + 234);
    try {
      if (info === "loged_in") {
        let menu = [
          { name: "My Community", herf: "MyCommunity" },
          { name: "profile", herf: "consoles/userProfile.html" },
          { name: "NOtificatios", herf: "#" },
          { name: "joined Events", herf: "consoles/joinedEvent.html" },
          { name: "about", herf: "#" },
          { name: "Logout", herf: "logoutAll" }
        ];
        socket.emit("take-menu", menu);
      } else if (info === "remain") {
        let menu = [
          { name: "logIn", herf: "logIn" },
          // { name: "Log in", herf: "logIn" },
          // { name: "Sign in", herf: "signIn" },
          { name: "signup", herf: "signUp" },
          { name: "about us", herf: "HTML/about.html" },
          { name: "communities", herf: "HTML/result_form.html" },
        ];
        socket.emit("take-menu", menu);
      } else if (info === "supervisor") {
        let menu = [
          { name: "My Community", herf: "MyCommunity" },
          { name: "topper", herf: "HTML/topper.html" },
          { name: "Logout", herf: "logoutAll" },
          { name: "Post Result", herf: "HTML/result_form.html" },
          { name: "Draft Result", herf: "HTML/draft_result.html" },
          { name: "Batches", herf: "HTML/fee_structure.html" },
          { name: "About Us", herf: "HTML/about.html" },
          { name: "Console", herf: "management_console" },
        ];
        socket.emit("take-menu", menu);
      }
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("send-data-of-community" , async()=>{
    const token_obj = cookie.parse(socket.handshake.headers.cookie);

    const token = token_obj.jwt_user;
    if (token !== undefined) {
      const verifyUser = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
      const user = await users.findOne({ _id: verifyUser._id });
      
          if (token_id) {
          let owner;
            user.communities.forEach(async element =>{
                if (element == token_id._id) {
                  owner = true
                }
              })
              console.log(owner)
              let community = await Communities.find({_id : token_id._id})
              await socket.emit("take-data-of-community" , community[0] , owner)
          }
    }else{
      let community = await Communities.find({_id : token_id._id})
      await socket.emit("take-data-of-community" , community[0] , false)
    }
  })


  socket.on("give-this-community-data" , async communityId=>{
    let community = await Communities.find({_id : communityId})
    console.log(community)
    let data = {communityName : community[0].communityName , communityId : community[0]._id , communityProfile : community[0].communityProfile}
    console.log(data)
    socket.emit("take-this-community-data" , data )
  })
  // ================= DISCONECT INFORMER =================//
  socket.on("disconnect", () => {
    console.log(socket.id + " disconnected");
  });
});
