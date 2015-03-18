import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel() {
    if (!this.get('session.isAuthenticated')) {
      this.transitionTo('login');
    }
  },

  model() {
    return this.store.find('team');
  },

  afterModel() {
    return this.get('session.currentUser.teams');
  },

  setupController(controller, model) {
    controller.set('model', model); // teams
  },

  redirect() {
    if (!this.get('session.isAuthenticated')) {
      this.transitionTo('index');
    }
    if (!this.get('session.currentUser.canSelectTeams')) {
      this.transitionTo('index');
    }
  }
});
