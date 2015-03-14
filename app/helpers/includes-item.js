import Ember from 'ember';

export function includesItem(params) {
  let [item, array] = params;
  if (!array) { return false; }
  return array.contains(item);
}

export default Ember.HTMLBars.makeBoundHelper(includesItem);
