const http = require('http');
const express=require('express');
const port = process.env.PORT || 3000
const app = express()


app.get('/', (req, res) => {
  res.send('Hello World!')
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
