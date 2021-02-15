const express=require('express');
const mongoose=require('mongoose');
var cors = require('cors')
const app = express();
var http = require('http').createServer(app)
const io = require('socket.io')(http);
const bodyParser=require('body-parser');
require('dotenv');
const port = process.env.PORT || 4000
var waiting=null;


app.use(cors());

mongoose.connect("mongodb+srv://UsersDB:mikkuo8279459923@cluster0.qcost.mongodb.net/UsersDB?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const chatSchema= new mongoose.Schema([{
  id: String,
  chat:[{
    name: String,
    message: String
  }]
}]);

const taskSchema=new mongoose.Schema([{
  name: String,
  tasklist: [{
    task: String,
    read: Boolean
  }]
}]);

const feedbackSchema=new mongoose.Schema([{
  name: String,
  email: String,
  mobile: String,
  description: String
}]);

mongoose.set("useCreateIndex", true);

const Chat= new mongoose.model('Chat', chatSchema);
const Task=new mongoose.model('Task', taskSchema);
const Feeds=new mongoose.model('Feeds', feedbackSchema);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.set("view engine", "ejs");
app.use(express.static("public"));

// get request for login page
app.get('/', (req, res) => {
  res.render('./pages/login');
})

// get request for login page
app.get('/login', (req,res)=>{
  res.render('./pages/login');
})

// get request for signin page
app.get('/signup', (req,res)=>{
  res.render('./pages/signup');
})

// get request for chatroom
app.get('/chatroom', (req,res)=>{
  res.render('./pages/message');
})

app.get('/todo', (req,res)=>{
  Chat.findOne({id: 'Mickey123'},(err, data)=>{
    if(err){
      console.log('Data is not exists');
    }
    if(data){
      console.log(data);
      res.send(data.chat);
    }
  })
})



io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    Chat.findOne({id: msg.id}, (err, foundData)=>{
      if(foundData){
        Chat.updateOne({id: msg.id}, {$push: {chat:{name: msg.name, message: msg.message}}}, (err)=>{
          if(err) throw err;
        });

        Chat.findOne({id: msg.id}, (geterr, getchats)=>{
          if(err) throw geterr;
          console.log(getchats);
          io.emit('chat message', getchats);
        })
      }else{
        var chat= new Chat({
          id: msg.id,
        });

        chat.save(function(err,data){
          if(err) throw err;

          Chat.updateOne({id: data.id}, {$push: {chat:{name: msg.name, message: msg.message}}}, (err)=>{
            if(err) throw err;
          });

          Chat.findOne({id: data.id}, (geterr, getchats)=>{
            if(err) throw geterr;
            console.log(getchats);
            io.emit('chat message', getchats);
          })
        })
      }
    });

  });
});

app.get('/api/tasks/:name',cors(), (req,res)=>{
  Task.find({name: req.params.name}, (err,tasks)=>{
    if(err){
      console.log(err);
      res.send('tasks not found');
    }else{
      res.send({tasks: tasks});
    } 
    
  })
});

app.post('/api/tasks/:name/:task',cors(), (req,res)=>{
  Task.findOne({name: req.params.name}, (err, data)=>{
    if(data){
      Task.updateOne({name: req.params.name}, {$push:{tasklist: {message: req.params.task, read: false}}}, function(error, founddata){
        if(error){
          console.log("error");
          res.send('server error, Try later');
        }else{
          console.log(founddata);
          res.send(founddata);
        }
      })
    }else{
      let task=new Task({
        name: req.params.name
      });

      task.save(function(error, founddata){
        if(error) console.log(error);
        else{
          Task.updateOne({name: req.params.name}, {$push:{tasklist: {message: req.params.task, read: false}}}, function(error, data){
            if(error){
              console.log("error");
              res.send('server error, Try later');
            }else{
              console.log(data);
              res.send(data);
            }
          })
        }
      })
    }
  })
})

app.post('/api/contact/:passkey',cors(), function(req,res){
  if(req.params.passkey=="chalchutiye"){
    let name=req.body.name;
  let email=req.body.email;
  let mobile=req.body.mobile;
  let description=req.body.description;
  let feeds=new Feeds({
    name: name,
    email: email,
    mobile: mobile,
    description: description
  });

  feeds.save(function(err, founddate){
    if(err) throw err;
    console.log(founddate);
  })
  }else{
    res.send({
      status: "fuck off"
    })
  }
});

http.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/html');
//   res.end('<h1>This app is created by me you mother fuckers</h1>');
// });

// server.listen(port,() => {
//   console.log(`Server running at port `+port);
// });
