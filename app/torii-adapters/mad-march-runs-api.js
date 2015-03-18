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

function identifyUser(user){
  if (!user) { return; }
  if (window.Rollbar) {
    window.Rollbar.configure({
      payload: {
        person: {
          id: user.get('id'),
          email: user.get('email')
        }
      }
    });
  }
}

export function clearSession(){
  storage.remove(config.authTokenKey);
}

export default Ember.Object.extend({
  store: Ember.Service.inject,

  fetch() {
    return new Ember.RSVP.Promise( (resolve) => {
      let tokenPayload = storage.read(config.authTokenKey);
      if (!tokenPayload) { throw 'no tokenpayload found'; }
      return resolve(this.store.push('token', tokenPayload));
    }).then( (token) => {
      return Ember.RSVP.hash({
        currentUser: token.get('user')
      });
    }).then((results) => {
      identifyUser(results.currentUser);
      return results;
    }).catch( (e) => {
      clearSession();
      throw e;
    });
  },

  open(tokenData) {
    return new Ember.RSVP.Promise( (resolve) => {
      return resolve(this.store.push('token', tokenData));
    }).then( (token) => {
      persistSession(token);
      return Ember.RSVP.hash({
        currentUser: token.get('user')
      });
    }).then((results) => {
      identifyUser(results.currentUser);
      return results;
    }).catch( (e) => {
      clearSession();
      throw e;
    });
  },

  close(){
    return new Ember.RSVP.Promise( (resolve) => {
      clearSession();
      resolve();
    });
  }
});
