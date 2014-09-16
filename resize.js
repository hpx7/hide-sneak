var gm = require('gm');

gm(process.argv[2]).resize(320, 240).flatten().write('self.png', function () {

});