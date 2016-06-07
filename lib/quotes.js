'use strict';
var fs = require('fs');
var moment = require('moment');

function read (filename) {

  // start log
  var MESSAGE = 'reading... ';
  process.stdout.write(MESSAGE);

  // read file
  var data = fs.readFileSync(filename, 'utf8');
  data = data.replace(/\r/gi, '');

  // split into lines
  var lines = data.split('\n');

  // iterate lines
  var l, lmax = lines.length, cells, c;
  for (l = 0; l < lmax; l++) {

    // log
    process.stdout.cursorTo(MESSAGE.length);
    process.stdout.clearLine(1); // to the right from cursor
    process.stdout.write(Math.round(l / lmax * 100) + '%');

    // split line into cells
    cells = lines[l].split(';');

    // cast types
    c = cells.length;
    while (--c >= 0) cells[c] = Math.round(cells[c]);

    // replace
    lines[l] = cells;
  }

  // end log
  process.stdout.clearLine();
  process.stdout.cursorTo(0);

  // return
  return lines;
}

function parse (data) {
  for (var i = 0; i < data.length; i++)
    data[i] = {
      dt: moment('' + data[i][0] + data[i][1], 'YYYYMMDDHHmmss').toDate(),
      date:   Math.round(data[i][0]),
      time:   Math.round(data[i][1]),
      open:   Math.round(data[i][2]),
      high:   Math.round(data[i][3]),
      low:    Math.round(data[i][4]),
      close:  Math.round(data[i][5]),
      volume: Math.round(data[i][6])
    };
  return data;
}

module.exports = {
  read: read,
  parse: parse
};
