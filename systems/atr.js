'use strict';
var ind = require('../indicators');
var acc = require('../account');
module.exports = function (data, params) {
  var param0 = Math.round(params[0]);
  var chart = '';
  var atr;
  for (var i = 0; i < data.length; i++) {

    // indicator
    atr = ind.atr(data, i, param0);

    // orders
    var position = acc.getPosition();
    if (atr <= 40 && position === 0) acc.setOrder({ dir: 'b', mkt: true, volume: 1 });
    if (atr >= 60 && position === 1) acc.setOrder({ dir: 's', mkt: true, volume: 1 });

    // trade
    var equity = acc.doTrade(data[i]);
    chart += equity + '\n';
  }
  return chart;
};
