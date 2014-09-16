var express = require('express');
var app = express();

app.get('*', function (req, res) {
  console.log(req.url);
  res.end('hello');
});

app.listen(3000);
