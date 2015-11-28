'use strict';
var fs = require('fs');
var lib = require('./lib');

var data = lib.quotes.parse(lib.quotes.read(process.argv[2]));
var system = require(process.argv[3]);

var res = system(data, process.argv.slice(4));
fs.writeFileSync('__result', res);
