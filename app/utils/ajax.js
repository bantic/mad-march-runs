import Ember from "ember";

export default function(url, options){
  return new Ember.RSVP.Promise(function(resolve, reject){
    options.dataType = 'json';
    options.success = Ember.run.bind(null, resolve);
    options.error = Ember.run.bind(null, reject);
    options.crossDomain = true;
    options.contentType = 'application/json';
    options.data = JSON.stringify(options.data);
    Ember.$.ajax(url, options);
  });
}
