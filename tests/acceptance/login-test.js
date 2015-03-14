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
  assert.expect(3);

  let email = 'abc@example.com',
      password = 'abc!@#';

  stubRequest('post', 'sessions', function(request){
    assert.ok(true, 'posts to sessions/new');
    let json = this.json(request);
    assert.equal(json.email, email, 'has correct email');
    assert.equal(json.password, password, 'has correct password');
    return this.success();
  });

  visit('/login');

  andThen(function() {
    fillIn('input[name="email"]', email);
    fillIn('input[name="password"]', password);
    click('.btn:contains(Log in)');
  });
});
