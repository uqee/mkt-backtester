'use strict';
var equity = 0;
var position = 0;
var commission = 0.00005;
var slippage = 0.0002;
var orders = [];

function setOrder (_order) {
  if (!_order.volume) _order.volume = 1;
  orders.push(_order);
}

function doTrade (_candle) {

  function buy (volume, price) {
    position += volume;
    equity -= (volume * price) * (1 + commission);
  }

  function sell (volume, price) {
    position -= volume;
    equity += (volume * price) * (1 - commission);
  }

  // orders
  var i = orders.length, order;
  while (--i >= 0) {
    order = orders[i];
    if (!order.filled) {
      if (order.dir === 'b') {
        if (order.mkt)                              { order.filled = 'mkt';  buy(order.volume, _candle.close); }
        if (order.lmt && _candle.low  <= order.lmt) { order.filled = 'lmt';  buy(order.volume, order.lmt); }
        if (order.stp && _candle.high >= order.stp) { order.filled = 'stp';  buy(order.volume, order.stp * (1 + slippage)); }
        if (order.sl  && _candle.low  <= order.sl)  { order.filled = 'sl';  sell(order.volume, order.sl  * (1 - slippage)); }
        if (order.tp  && _candle.high >= order.tp)  { order.filled = 'tp';  sell(order.volume, order.tp); }
      }
      else if (order.dir === 's') {
        if (order.mkt)                              { order.filled = 'mkt'; sell(order.volume, _candle.close); }
        if (order.lmt && _candle.high >= order.lmt) { order.filled = 'lmt'; sell(order.volume, order.lmt); }
        if (order.stp && _candle.low  <= order.stp) { order.filled = 'stp'; sell(order.volume, order.stp * (1 - slippage)); }
        if (order.sl  && _candle.high >= order.sl)  { order.filled = 'sl';   buy(order.volume, order.sl  * (1 + slippage)); }
        if (order.tp  && _candle.low  <= order.tp)  { order.filled = 'tp';   buy(order.volume, order.tp); }
      }
    }
  }

  // equity
  return Math.round(equity + position * _candle.close);
}

function getPosition () {

  return position;
}

module.exports = {
  setOrder: setOrder,
  doTrade: doTrade,
  getPosition: getPosition
};
