import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Route.extend({
  model(){
    return this.store.createRecord('user');
  },

  setupController(controller, model){
    controller.set('model', model);
    controller.set('success', false);
  },

  actions: {
    signUp(){
      let user = this.currentModel;
      return user.save().then( () => {
        this.controller.set('success', true);
      }).catch( (e) => {
        if (e instanceof DS.InvalidError) {
          // no op, show errors on model
        } else {
          throw e;
        }
      });
    }
  }
});
