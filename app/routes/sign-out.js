import Ember from 'ember';
export default Ember.Route.extend({
  redirect(){
    return this.get('session').close('mad-march-runs-api').then( () => {
      this.transitionTo('login');
    });
  }
});
