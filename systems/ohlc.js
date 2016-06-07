'use strict';
var lib = require('../lib');
module.exports = function (data, params) {
  var param0 = Math.round(params[0]);
  var chart = '';

  lib.orders.create({
    dir: lib.orders.DIR_SELL,
    type: lib.orders.TYPE_LMT,
    price: 90000,
    sl: 1000,
    tp: 4000
  });

  for (var i = 0; i < data.length; i++) {

    // orders
    //var position = lib.orders.getPosition();
    //if (!position)

    // trade
    var equity = lib.orders.trade(data[i]);
    chart += equity + '\n';
  }
  return chart;
};
