const express=require('express');
const mongoose=require('mongoose');
const port = process.env.PORT || 3000
const app = express();
var http = require('http').createServer(app)
const io = require('socket.io')(http);
const bodyParser=require('body-parser');
require('dotenv');
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
}])
mongoose.set("useCreateIndex", true);

const Chat= new mongoose.model('Chat', chatSchema);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.set("view engine", "ejs");
app.use(express.static("public"));


app.get('/', (req, res) => {
  res.render('./pages/index');
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

app.get('/pop', (req,res)=>{
  todo.pop();
  res.send('one element deleted');
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
