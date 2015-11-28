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
    //var position = acc.getPosition();
    //if (position > 0 && slope >= -param0) acc.setOrder({ dir: 's', mkt: true, volume:  position });
    //if (position < 0 && slope <=  param0) acc.setOrder({ dir: 'b', mkt: true, volume: -position });
    if (slope >=  param0) lib.orders.create({ dir: lib.orders.DIR_BUY });
    if (slope <= -param0) lib.orders.create({ dir: lib.orders.DIR_SELL });

    // trade
    var equity = lib.orders.trade(data[i]);
    chart += equity + '\n';
  }
  return chart;
};
