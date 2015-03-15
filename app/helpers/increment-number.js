import Ember from 'ember';

export function incrementNumber(params /*, hash*/) {
  let [value, incrementValue] = params;
  if (!value) { return; }
  if (!incrementValue) { incrementValue = 1; }
  return value + incrementValue;
}

export default Ember.HTMLBars.makeBoundHelper(incrementNumber);
