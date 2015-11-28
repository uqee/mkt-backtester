'use strict';
var fs = require('fs');
var lib = require('./lib');

function byTicks (data, _filename, _period) {

  // start log
  var MESSAGE = 'aggregating... ';
  process.stdout.write(MESSAGE);

  // define period
  var imax = data.length;
  var period = Math.round(_period) || Math.max(Math.round(imax / 1000), 1);
  var text = '';

  //
  var i, j, date, time, open, high, low, close, volume, _first = true;
  for (i = period; i < imax; i += period) {

    // log
    process.stdout.cursorTo(MESSAGE.length);
    process.stdout.clearLine(1); // to the right from cursor
    process.stdout.write(Math.round(i / imax * 100) + '%');

    //
    var ileft = i - period;
    var iright = i - 1;

    // alloc
    date = data[ileft][0];
    time = data[ileft][1];
    open = data[ileft][2];
    high = -Infinity;
    low = Infinity;
    close = data[iright][2];
    volume = 0;

    // calc
    for (j = ileft; j <= iright; j++) {
      high = Math.max(high, data[j][2]);
      low = Math.min(low, data[j][2]);
      volume += data[j][3];
    }

    // save
    if (!_first) text += '\n'; else _first = false;
    text += date + ';' + time + ';' + open + ';' + high + ';' + low  + ';' + close + ';' + volume;
  }

  // end log
  process.stdout.clearLine();
  process.stdout.cursorTo(0);

  // dump cache to a file
  var path = require('path');
  var filename = path.join(path.dirname(_filename), path.basename(_filename) + '.t' + period);
  fs.writeFileSync(filename, text);
  console.log('-> ' + filename);
}

var FILENAME = process.argv[2];
var PERIOD = process.argv[3];
byTicks(lib.quotes.read(FILENAME), FILENAME, PERIOD);
