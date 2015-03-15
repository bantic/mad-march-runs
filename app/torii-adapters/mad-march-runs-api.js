import Ember from 'ember';
import storage from '../utils/storage';
import config from '../config/environment';

function persistSession(token){
  storage.write(config.authTokenKey, {
    id:    Ember.get(token, 'id'),
    token: Ember.get(token, 'token'),
    email: Ember.get(token, 'email'),
    user:  Ember.get(token, 'user.id')
  });
}

export function clearSession(){
  storage.remove(config.authTokenKey);
}

export default Ember.Object.extend({
  store: Ember.Service.inject,

  open(tokenData) {
    return new Ember.RSVP.Promise( (resolve) => {
      return resolve(this.store.push('token', tokenData));
    }).then( (token) => {
      persistSession(token);
      return Ember.RSVP.hash({
        currentUser: token.get('user')
      });
    }).catch( (e) => {
      clearSession();
      throw e;
    });
  }
});
