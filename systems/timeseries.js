'use strict';
var timeseries = require('timeseries-analysis');

module.exports = function (data, params) {
  var SLICE_START = 1000;
  var SLICE_LENGTH = 500;

  // load
  var t = new timeseries.main(
    timeseries.adapter.fromDB(data.slice(SLICE_START, SLICE_START + SLICE_LENGTH), {
      date: 'dt',
      value: 'close'
    })
  );

  // smooth
  //t.smoother({ period: 100 }).save('smooth');
  //t.smoother({ period: 100 }).noiseData().save('noise');
  console.log(t.smoother({ period: 25 }).chart({ main: true }));

  /*
  var chart = '';
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
  */
};
