import Ember from 'ember';
import DS from 'ember-data';

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

  resetController(controller){
    controller.set('errorSavingPick', false);
  },

  actions: {
    deselectMatchup(game) {
      game.set('isSelected', false);
      this.controller.set('errorSavingPick', false);
    },

    selectMatchup(game, round) {
      this.controller.set('errorSavingPick', false);
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
      this.controller.set('errorSavingPick', false);

      pick.save().catch( (e) => {
        let errorMessage = `There was an error: ${e.message}`;
        if (e instanceof DS.InvalidError) {
          let messages = [];
          pick.get('errors').forEach( (error) => {
            if (error.attribute === 'base') {
              messages.push(error.message);
            } else {
              messages.push(`${error.attribute}: ${error.message}`);
            }
          });
          errorMessage = `There were some errors: ${messages.join(', ')}`;
        }
        this.controller.set('errorSavingPick', errorMessage);
        pick.destroy();
      }).finally( () => {
        this.controller.set('isSavingPick', false);
      });
    }
  }
});
