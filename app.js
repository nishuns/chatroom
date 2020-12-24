const express=require('express');
const port = process.env.PORT || 3000
const app = express();
var http = require('http').createServer(app)
const io = require('socket.io')(http);
const bodyParser=require('body-parser');
var waiting=null;

var todo=[];
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.set("view engine", "ejs");
app.use(express.static("public"));


app.get('/', (req, res) => {
  res.render('./pages/index', {tasks: todo});
})

app.post('/todo', (req,res)=>{
  console.log(req.body.task);
  todo.push(req.body.task);
  res.redirect('/');
})

app.get('/pop', (req,res)=>{
  todo.pop();
  res.send('one element deleted');
})

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
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
