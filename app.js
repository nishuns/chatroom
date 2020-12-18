var express = require("express");
var app = express();
var cors=require('cors');
var cookieSession=require('cookie-session');
var bodyParser=require('body-parser');
var firebase=require('firebase');
require("firebase/auth");

app.use(cors());

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(cookieSession({
  name: "my experiment",
  keys: ["key1", "key2"]
}))


app.set("view engine", "ejs");
app.use(express.static("public"));

var firebaseConfig = {
  apiKey: "AIzaSyDlnVyvwidNZRwoK3LrjIVY8vLuVsgzHWE",
  authDomain: "scenic-healer-285106.firebaseapp.com",
  projectId: "scenic-healer-285106",
  storageBucket: "scenic-healer-285106.appspot.com",
  messagingSenderId: "174602061790",
  appId: "1:174602061790:web:241bc1eb076b474815ff4f",
  measurementId: "G-RG1H6EGQWW"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

app.get("/", function (req, res) {
    res.render("./pages/main", {
    });
});

app.get("/takedata", function(req,res){
  res.send('MY NAME IS NISCHAY');
})

app.post('/verification', function(req,res){
  console.log(req.body.ver);
  res.send('data recieved');
})

app.get("/success",function(req,res){
  console.log("successfully registers");
  res.send('email verified successfully');
  
})


app.listen(process.env.PORT || 3000);
console.log("connecting Port :8080\nhttp://localhost:8080");