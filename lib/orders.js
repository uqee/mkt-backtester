'use strict';
module.exports = function (_commission, _slippage) {

  // var

    var STATUS_ACTIVE = 0;
    var STATUS_OPENED = 1;
    var STATUS_CLOSED = 2;
    var STATUS_CANCELLED = 4;

    var TYPE_MKT = 0;
    var TYPE_LMT = 1;
    var TYPE_STP = 2;

    var DIR_BUY = 0;
    var DIR_SELL = 1;

    var COMMISSION = _commission || 0.00005;
    var SLIPPAGE = _slippage || 0.0002;

    var equity = 0;
    var position = 0;
    var orders = [];

  // get

    function getPosition () {

      return position;
    }

  // set

    function setSl (id, sl) {
      var order = orders[id];
      if (order.status === STATUS_ACTIVE || order.status === STATUS_OPENED) order.sl = sl;
    }

    function setTp (id, tp) {
      var order = orders[id];
      if (order.status === STATUS_ACTIVE || order.status === STATUS_OPENED) order.tp = tp;
    }

  // do

    function create (order) {
      order.status = STATUS_ACTIVE;
      order.type = order.type || TYPE_MKT;
      order.volume = order.volume || 1;
      orders.push(order);
      return (orders.length - 1);
    }

    function fill (order, price) {
      if (order.status === STATUS_ACTIVE) { order.status = STATUS_OPENED; order.pricein = price; }
      if (order.status === STATUS_OPENED) { order.status = STATUS_CLOSED; order.priceout = price; }

      if (order.dir === DIR_BUY) {
        position += order.volume;
        equity -= (order.volume * price) * (1 + COMMISSION);
      }
      else if (order.dir === DIR_SELL) {
        position -= order.volume;
        equity += (order.volume * price) * (1 - COMMISSION);
      }
    }

    function cancel (id) {
      var order = orders[id];
      if (order.status === STATUS_ACTIVE) order.status = STATUS_CANCELLED;
    }

    function trade (_candle) {
      var i = orders.length, order;
      while (--i >= 0) {
        order = orders[i];
        if (order.dir === DIR_BUY) {
          switch (order.status) {

            case STATUS_ACTIVE:
              switch (order.type) {
                case TYPE_MKT: fill(order, _candle.close); break;
                case TYPE_LMT: if (order.price >= _candle.low)  fill(order, order.price); break;
                case TYPE_STP: if (order.price <= _candle.high) fill(order, order.price * (1 + SLIPPAGE)); break;
              }
              break;
            
            case STATUS_OPENED:
              if (order.sl >= _candle.low)  fill(order, order.sl * (1 - SLIPPAGE));
              if (order.tp <= _candle.high) fill(order, order.tp);
              break;
          
          }
        } else if (order.dir === DIR_SELL) {
          switch (order.status) {

            case STATUS_ACTIVE:
              switch (order.type) {
                case TYPE_MKT: fill(order, _candle.close); break;
                case TYPE_LMT: if (order.price <= _candle.high) fill(order, order.price); break;
                case TYPE_STP: if (order.price >= _candle.low)  fill(order, order.price * (1 - SLIPPAGE)); break;
              }
              break;
            
            case STATUS_OPENED:
              if (order.sl <= _candle.high) fill(order, order.sl * (1 + SLIPPAGE));
              if (order.tp >= _candle.low)  fill(order, order.tp);
              break;
          
          }
        }
      }
      return Math.round(equity + position * _candle.close);
    }

  return {
    TYPE_MKT: TYPE_MKT,
    TYPE_LMT: TYPE_LMT,
    TYPE_STP: TYPE_STP,

    DIR_BUY:  DIR_BUY,
    DIR_SELL: DIR_SELL,

    getPosition: getPosition,

    setSl: setSl,
    setTp: setTp,

    create: create,
    fill: fill,
    cancel: cancel,
    trade: trade
  };
};
