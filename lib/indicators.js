'use strict';

function atr (quotes, position, period) {
  if (position < period || position > quotes.length) return null;
  
  var sum = 0, i;
  for (i = position - period + 1; i <= position; i++)
    sum += (quotes[i].high - quotes[i].low);
  
  return Math.round(sum / period);
}

function ma (quotes, position, period) {
  if (position < period || position > quotes.length) return null;
  
  var sum = 0, i;
  for (i = position - period + 1; i <= position; i++)
    sum += quotes[i].close;
  
  return Math.round(sum / period);
}

module.exports = {
  atr: atr,
  ma: ma
};
