'use strict';
var ind = require('../indicators');

function run (data, params) {
  var pnl = 0, res = '';
  var param0 = Math.round(params[0]);
  var param1 = Math.round(params[1]);
  var slope;
  for (var i = 3; i < data.length; i++) {
    slope = data[i-1].close - data[i-2].close;

    // long
    if (slope > param0) {

      if (data[i].high >= data[i].open + param1) pnl += param1;
      else pnl += (data[i].close - data[i].open);
    }

    // short
    else if (slope < -param0) {

      if (data[i].low <= data[i].open - param1) pnl += param1;
      else pnl += (data[i].open - data[i].close);
    }

    //pnl = Math.round(pnl * 100);
    if (pnl) res += pnl + '\n';
  }
  return res;
}

module.exports = run;
