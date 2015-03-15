import Ember from 'ember';

export default Ember.Object.extend({
  store: Ember.Service.inject,

  open(tokenData) {
    return new Ember.RSVP.Promise( (resolve) => {
      return resolve(this.store.push('token', tokenData));
    }).then( (token) => {
      return token.get('user');
    });
  }
});
