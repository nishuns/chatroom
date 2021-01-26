const express=require('express');
const mongoose=require('mongoose');
const app = express();
var http = require('http').createServer(app)
const io = require('socket.io')(http);
const bodyParser=require('body-parser');
require('dotenv');
const port = process.env.PORT || 4000
var waiting=null;

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
  message: String,
  read: Boolean
}]);

mongoose.set("useCreateIndex", true);

const Chat= new mongoose.model('Chat', chatSchema);
const Task=new mongoose.model('Task', taskSchema);

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

app.get('/api/tasks', (req,res)=>{
  Task.find({}, (err,tasks)=>{
    if(err) console.log(err);
    res.send({tasks: tasks});
  })
});

app.get('/api/task/:taskid', (req,res)=>{
  Task.findOne({_id: req.params.taskid}, (err, task)=>{
    if(err) console.log(err);
    res.send(task);
  })
})

app.post('/api/tasks/:task', (req,res)=>{
  let task=new Task({
    message: req.params.task,
    read: false
  });

  task.save(function(err,data){
    if(err) console.log(err)
    else{
      res.send("Task Added successfully");
    }
  })
})

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
