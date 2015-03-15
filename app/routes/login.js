import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    login: function(email, password){
      let creds = {email, password};
      return this.get('session').open('mad-march-runs-api', creds).then( () => {
        this.transitionTo('index');
      });
    }
  }
});
