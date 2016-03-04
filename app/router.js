import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('login');
  this.route('select-teams');
  this.route('sign-up');
  this.route('sign-out');
  this.route('rules');
  this.route('picks');

  this.route('not-found', {path:'/*wildcard'});
});

export default Router;
