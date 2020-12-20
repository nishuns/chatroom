const express=require('express');
const port = process.env.PORT || 3000
const app = express();

var waiting=null;

app.set("view engine", "ejs");
app.use(express.static("public"));


app.get('/', (req, res) => {
  res.render('./pages/index', {number: waiting});
})

app.post('/calc', (req,res)=>{
  waiting=req.body.val;
  console.log(req.body.val);
  res.send('got data');
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/html');
//   res.end('<h1>This app is created by me you mother fuckers</h1>');
// });

// server.listen(port,() => {
//   console.log(`Server running at port `+port);
// });
