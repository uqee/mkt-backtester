'use strict';
module.exports = function (data, params) {
  var chart = '';
  for (var i = 0; i < data.length; i++)
    //chart += ((data[i].open - data[i].low) / (data[i].high - data[i].low)) + '\n';
    chart += data[i].close + '\n';
  return chart;
};
