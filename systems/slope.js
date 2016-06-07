'use strict';
var lib = require('../lib');
module.exports = function (data, params) {
  var param0 = Math.round(params[0]);
  var chart = '';
  var slope;
  for (var i = 2; i < data.length; i++) {

    // indicator
    slope = data[i-1].close - data[i-2].close;

    // orders
    var position = lib.orders.getPosition();
    if (!position) {
      if (slope >= param0) lib.orders.create({ dir: lib.orders.DIR_BUY, sl: 100 });
      //else if (slope <= -param0) lib.orders.sell({ sl: 40, tp: 120 });
    }
    else if (position * slope < 0) lib.orders.flat();

    // trade
    var equity = lib.orders.trade(data[i]);
    chart += equity + '\n';
  }
  return chart;
};
