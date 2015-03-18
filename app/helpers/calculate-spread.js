import Ember from 'ember';

export function calculateSpread(params) {
  let teams = params[0];

  let team1 = teams.get('firstObject');
  let team2 = teams.get('lastObject');

  let seed1 = team1.get('seed');
  let seed2 = team2.get('seed');

  if (seed1 < seed2) {
    return `${team1.get('name')} ${seed1 - seed2}`;
  } else if (seed1 > seed2) {
    return `${team2.get('name')} ${seed2 - seed1}`;
  } else {
    return '0';
  }
}

export default Ember.HTMLBars.makeBoundHelper(calculateSpread);
