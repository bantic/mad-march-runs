import Ember from 'ember';
import { stubRequest } from 'ember-cli-fake-server';

export default function() {
  Ember.Test.registerAsyncHelper('signIn', function(app, userData){
    userData = userData || {};
    let defaultUserData = {
      id: 'user1',
      name: 'stubbed user',
      email: 'stubbed-user@gmail.com',
    };

    userData = Ember.$.extend(true, defaultUserData, userData);

    stubRequest('get', 'api/users/:id', function(request){
      return this.success({user: userData});
    });

    stubRequest('post', 'api/tokens', function(request){
      return this.success({
        id: 'token',
        token: 'abcdef',
        email: userData.email,
        user: userData.id
      });
    });

    visit('/login');
    fillIn('input[name="email"]', userData.email);
    fillIn('input[name="password"]', 'somepassword');
    click('.btn.log-in');
  });
}
