import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from 'mad-march-runs/tests/helpers/start-app';

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
