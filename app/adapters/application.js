import DS from 'ember-data';
import config from '../config/environment';
import storage from '../utils/storage';
import Ember from 'ember';

export default DS.ActiveModelAdapter.extend({
  host: config.apiHost,
  namespace: config.apiNamespace,

  headers: function(){
    let headers = {};
    let token = storage.read(config.authTokenKey);

    if (token) {
      headers['Authorization'] =
        `Token token=${token.token}, email=${token.email}`;
    }

    return headers;
  }.property().volatile(),

  ajaxError: function(jqXHR) {
    var error = this._super(jqXHR);
    if (jqXHR && jqXHR.status === 422) {
      var response = Ember.$.parseJSON(jqXHR.responseText),
          errors = {};

      if (response.errors) {
        var jsonErrors = response.errors;
        Ember.keys(jsonErrors).forEach(function(key) {
          errors[Ember.String.camelize(key)] = jsonErrors[key];
        });

        return new DS.InvalidError(errors);
      } else {
        return error;
      }
    } else {
      return error;
    }
  }
});
