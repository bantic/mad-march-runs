import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.find('team');
  },

  afterModel() {
    return this.get('session.currentUser.teams');
  },

  setupController(controller, model) {
    controller.set('model', model); // teams
  },

  actions: {
    selectTeam(team) {
      let user = this.get('session.currentUser');
      user.get('teams').pushObject(team);
    },
    removeTeam(team) {
      let user = this.get('session.currentUser');
      user.get('teams').removeObject(team);
    }
  }
});
