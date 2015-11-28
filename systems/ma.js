'use strict';
var ind = require('../indicators');

function run (data, params) {
  var param0 = Math.round(params[0]);
  var pnl = 0, res = '';
  var ma, position = 0, openedat;

  for (var i = 0; i < data.length; i++) {
    ma = ind.ma(data, i, param0);
    if (ma) {

      // long
      if (data[i].open > ma) {
        if (openedat) pnl += position * (data[i].close - openedat);
        position = -1;
        openedat = data[i].low;
      }

      // short
      if (data[i].open < ma) {
        if (openedat) pnl += position * (data[i].close - openedat);
        position = 1;
        openedat = data[i].high;
      }

      //
      res += pnl + '\n';
    }
  }

  return res;
}

module.exports = run;
