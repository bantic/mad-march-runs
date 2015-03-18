import Ember from 'ember';

export default Ember.View.extend({
  hidePreLoading: function(){
    Ember.$('#preloading').remove();
  }.on('didInsertElement')
});
