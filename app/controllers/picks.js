import Ember from 'ember';

export default Ember.Controller.extend({
  roundsWithPicks: function(){
    let rounds = this.get('model');
    let picks = this.get('session.currentUser.picks');

    let result = [];

    rounds.forEach( (round) => {
      let foundPick;
      picks.forEach( (pick) => {
        if (pick.get('round.id') === round.get('id')) {
          foundPick = pick;
        }
      });
      result.push({round:round, pick:foundPick});
    });
    return result;

  }.property('model.[]', 'session.currentUser.picks.[]')
});
