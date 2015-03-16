import Ember from 'ember';
import getErrorMessage from '../utils/get-error-message';

export default Ember.Route.extend({
  redirect() {
    if (this.get('session.isAuthenticated')) {
      this.transitionTo('index');
    }
  },

  actions: {
    login: function(email, password){
      let creds = {email, password};
      return this.get('session').open('mad-march-runs-api', creds).then( () => {
        this.transitionTo('index');
      }).catch( (e) => {
        this.controller.set('error', getErrorMessage(e));
      }).finally( () => {
        this.controller.set('isSubmitting', false);
      });
    }
  }
});
