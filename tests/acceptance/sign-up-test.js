import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from 'mad-march-runs/tests/helpers/start-app';
import { stubRequest } from 'ember-cli-fake-server';

var application;

module('Acceptance: SignUp', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('visiting /sign-up', function(assert) {
  visit('/sign-up');

  andThen(function() {
    assert.equal(currentPath(), 'sign-up');
    expectElement('input[name="email"]');
    expectElement('input[name="password"]');
    expectElement('.btn.sign-up');
  });
});

test('visiting /sign-up and sign up', function(assert) {
  assert.expect(5);

  let email = 'abc@gmail.com',
      password = 'defhijk';

  visit('/sign-up');

  stubRequest('post', '/api/users', function(request){
    assert.ok(true, 'posts to create user');
    let json = this.json(request);
    assert.equal(json.user.email, email);
    assert.equal(json.user.password, password);

    return this.success({});
  });

  andThen( () => {
    fillIn('input[name="email"]', email);
    fillIn('input[name="password"]', password);
    click('.btn.sign-up');
  });
  andThen( () => {
    expectElement('.success');
    let text = find('.success').text();
    assert.ok(text.indexOf('Now go log in') > -1, 'shows success text');
  });
});

test('visiting /sign-up error saving user', function(assert) {
  assert.expect(2);

  let email = 'abc@gmail.com',
      password = 'defhijk';

  visit('/sign-up');

  stubRequest('post', '/api/users', function(request){
    return this.error({errors: {email: 'is already taken'}});
  });

  andThen( () => {
    fillIn('input[name="email"]', email);
    fillIn('input[name="password"]', password);
    click('.btn.sign-up');
  });

  andThen( () => {
    expectElement('.error');
    let text = find('.error').text();
    assert.ok(text.indexOf('Email is already taken') > -1, 'shows error text');
  });
});
