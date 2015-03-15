import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel(){
    return this.get('session').fetch('mad-march-runs-api').catch( () => {
      // no-op. if the user is not logged in that is fine
    });
  }
});
