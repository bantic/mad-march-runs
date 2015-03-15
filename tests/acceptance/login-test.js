import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from 'mad-march-runs/tests/helpers/start-app';
import { stubRequest } from '../helpers/fake-server';

var application;

module('Acceptance: Login', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('visiting /login', function(assert) {
  visit('/login');

  andThen(function() {
    assert.equal(currentPath(), 'login');
    expectElement('.btn:contains(Log in)');
    expectElement('input[name="email"]');
    expectElement('input[name="password"]');
  });
});

test('visiting /login and clicking login button posts data', function(assert) {
  assert.expect(5);

  let email = 'abc@example.com',
      password = 'abc!@#';
  let userId = '1';
  let tokenData = {
    id: 'auth-token',
    token: 'abcdef',
    email,
    user: userId
  };

  stubRequest('post', 'api/tokens', function(request){
    assert.ok(true, 'posts to tokens');
    let json = this.json(request);
    assert.equal(json.email, email, 'has correct email');
    assert.equal(json.password, password, 'has correct password');
    return this.success(tokenData);
  });

  stubRequest('get', `api/users/${userId}`, function(request){
    assert.ok(true, `gets user id ${userId}`);
    return this.success({
      user: {
        id: userId
      }
    });
  });

  visit('/login');

  andThen(() => {
    fillIn('input[name="email"]', email);
    fillIn('input[name="password"]', password);
    click('.btn:contains(Log in)');
  });

  andThen(() => {
    assert.equal(currentPath(), 'index');
  });
});

test('visiting /login with invalid creds', function(assert){
  assert.expect(2);

  let email = 'abc@example.com',
      password = 'badapssword';
  let userId = '1';
  let tokenData = {
    id: 'auth-token',
    token: 'abcdef',
    email,
    user: userId
  };

  stubRequest('post', 'api/tokens', function(request){
    assert.ok(true, 'posts to tokens');

    return this.error({error: 'wrong password'});
  });

  visit('/login');

  andThen(() => {
    fillIn('input[name="email"]', email);
    fillIn('input[name="password"]', password);
    click('.btn:contains(Log in)');
  });

  andThen(() => {
    expectElement('.error:contains(wrong password)');
  });
});
