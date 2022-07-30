const express=require('express');
const mongoose=require('mongoose');
var cors = require('cors')
const app = express();
var http = require('http').createServer(app)
const io = require('socket.io')(http);
const bodyParser=require('body-parser');
require('dotenv').config();
const port = process.env.PORT || 4000
var waiting=null;


app.use(cors());

mongoose.connect(process.env.db_uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Database is connected successfully");
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

const countSchema=new mongoose.Schema({
  count: Number
})

mongoose.set("useCreateIndex", true);

const Chat= new mongoose.model('Chat', chatSchema);
const Task=new mongoose.model('Task', taskSchema);
const Feeds=new mongoose.model('Feeds', feedbackSchema);
const Count=new mongoose.model('Count', countSchema);

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
  socket.on('broadcast-sender', (msg) => {
    console.log('broadcast-sender', msg);
    Chat.findOne({id: msg.id}, (err, foundData)=>{
      if(foundData){
        Chat.updateOne({id: msg.id}, {$push: {chat:{name: msg.name, message: msg.message}}}, (err)=>{
          if(err) throw err;
        });

        Chat.findOne({id: msg.id}, (geterr, getchats)=>{
          if(err) throw geterr;
          console.log(getchats);
          io.emit('broadcast-reciever', getchats);
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
    Count.findOne({_id: '602e1e8136886a9bffd783b9'}, function(error,data){
      console.log(data.count);
      Count.updateOne({_id: data._id}, {count: data.count+1}, (my_err)=>{
        if(my_err) console.log(my_err);
      })
    })
    res.send({
      status: "success",
      message: "Request Sent Successfully"
    })
  })
  }else{
    res.send({
      status: "fuck off"
    })
  }
});

app.get("/api/contacts", (req,res)=>{
    Feeds.find({}, function(err,data){
      res.render('./pages/contacts', {
        contacts: data
      })
    })
})

app.post("/api/delete/:id", (req,res)=>{
    Feeds.deleteOne({_id: req.params.id}, function(err){
      if(err) console.log(err);
      res.redirect('/api/contacts');
    })
})

http.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})

