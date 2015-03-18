import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel() {
    if (!this.get('session.isAuthenticated')) {
      this.transitionTo('login');
    }
  },

  model() {
    return this.store.find('round');
  },

  afterModel() {
    return Ember.RSVP.hash({
      picks: this.get('session.currentUser.picks')
    });
  },

  actions: {
    selectMatchup(game, round) {
      // unselect all other games
      round.get('games').then( (games) => {
        games.forEach( (_game) => {
          _game.set('isSelected', false);
        });
        game.set('isSelected', true);
      });
    },

    selectWinner(game, team){
      let user = this.get('session.currentUser');
      let pick = this.store.createRecord('pick');
      pick.setProperties({ user, game, team });

      this.controller.set('isSavingPick', true);
      pick.save().finally( () => {
        this.controller.set('isSavingPick', false);
      });
    }
  }
});
