var fs = require('fs'),
    https = require('https'),
    express = require('express'),
    request = require('request'),
    http = require('http');

    var app = express()

    http.createServer(app).listen(3000);

    https.createServer({
      key: fs.readFileSync('key.pem'),
      cert: fs.readFileSync('cert.pem')
    }, app).listen(5050);

    app.get('*', function (req, res) {
      console.log(req.url);
      res.header('Content-type', 'text/html');
      return res.end('<h1>Hello, Secure World!</h1>');
    });