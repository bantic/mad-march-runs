import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.find('round');
  },

  actions: {
    selectMatchup(game) {
      game.set('isSelected', true);
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
