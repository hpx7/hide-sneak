var fs = require('fs');
var express = require('express');
var request = require('request');
var http = require('http');
var gm = require('gm');
var spawn = require('child_process').spawn;

gm('contact.jpg').write('contact.png', function (err) {});
