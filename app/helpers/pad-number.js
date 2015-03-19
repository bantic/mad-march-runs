import Ember from 'ember';

export function padNumber(params) {
  let [number, padding, width] = params;
  let numberStr = ''+number;

  if (!padding) { padding = '0'; }
  if (!width) { width = 2; }

  while (numberStr.length < width) {
    numberStr = padding + numberStr;
  }

  return numberStr;
}

export default Ember.HTMLBars.makeBoundHelper(padNumber);
