import Ember from 'ember';

export default function() {
  Ember.Test.registerAsyncHelper('signIn', function(app, userData){
    userData = userData || {};
    let defaultUserData = {
      id: 'user1',
      name: 'stubbed user',
      email: 'stubbed-user@gmail.com',
    };

    userData = Ember.$.extend(true, defaultUserData, userData);

    let session = app.__container__.lookup('torii:session');
    let sm = session.get('stateMachine');

    Ember.run(function(){
      let store = app.__container__.lookup('store:main');
      let user = store.push('user', userData);

      sm.transitionTo('authenticated');
      session.set('content.currentUser', user);
    });
  });
}
