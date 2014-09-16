var fs = require('fs');
var express = require('express');
var request = require('request');
var http = require('http');
var gm = require('gm');
var sizeOf = require('image-size');
var spawn = require('child_process').spawn;

var app = express();

function canFitData(secretFilename, outputFilename){
  var availableBytes = fs.statSync(outputFilename)["size"];
  var bytesNeeded = fs.statSync(bytesNeeded)["size"];
  var bytesNeeded = bytesNeeded + 60; 
  console.log("canFit "+bytesNeeded + "<=" + availableBytes +" ?");
  return (fileSizeInBytes >= bytesNeeded);
}

var state = {};

app.get('*', function (req, res) {
  // console.log(req.url);
  var ext = req.url.substr(req.url.lastIndexOf('.') + 1).toLowerCase();
  var filename = req.url.substr(req.url.lastIndexOf('/') + 1);
  if ((ext === 'jpg' || ext === 'jpeg') && !state.done) {
    downloadUrl(req.url, filename, function (img) {
      var pngFilename = filename + '.png';
      gm(filename).write(pngFilename, function (err) {
        if (err) console.log(err);

        if (state.done) {
          req.pipe(request(req.url)).pipe(res);
          return;
        }

        if (Object.keys(state).length === 0) {
          var secretDim = sizeOf('selfie.png');
          state.totalSize = secretDim.width * secretDim.height * 24;
          state.written = 0;
          state.idx = 0;
          state.done = false;
        }

        console.log(req.url + ': ' + JSON.stringify(state));
        var dimensions = sizeOf(pngFilename);
        var bytesAvail = dimensions.width * dimensions.height * 3 - 60;
        if (state.written === state.totalSize) {
          console.log('done');
          state.done = true;
          req.pipe(request(req.url)).pipe(res);
          return;
        }
        if (state.written + bytesAvail > state.totalSize) {
          console.log('ending');
          bytesAvail = state.totalSize - state.written;
        }

        var imgIdx = state.idx;
        state.idx++;
        var start = state.written;
        state.written += bytesAvail;
        var end = state.written;

        var child = spawn('python', ['pipe.py'], '-u');
        var cmd = [pngFilename, imgIdx, start, end].join(' ');
        console.log(cmd);

        child.stdin.end(cmd);
        child.on('close', function () {
          fs.readFile('enc-' + pngFilename, function (err, encImg) {
            console.log('proxing ' + pngFilename);
            res.writeHead(200, {'Content-Type': 'image/png'});
            res.end(encImg, 'binary');
          });
        });
        child.stdout.on('data', function (data) {
          console.log('stdout: ' + data);
        });
        child.stderr.on('data', function (data) {
          console.log('stderr: ' + data);
        });
      });
    });
  } else {
    req.pipe(request(req.url)).pipe(res);
  }
});

function downloadUrl (url, filename, cb) {
  console.log('downloadUrl: ' + url);
  http.get(url, function (res) {
    var data = '';
    res.setEncoding('binary');
    res.on('data', function (chunk) {
      data += chunk;
    });
    res.on('end', function () {
      fs.writeFile(filename, data, 'binary', function () {
        cb(data);
      });
    });
  });
}

app.listen(5050);
