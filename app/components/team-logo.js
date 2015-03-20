import Ember from 'ember';
import layout from '../templates/components/team-logo';

export default Ember.Component.extend({
  layout: layout,
  team: null,
  tagName: 'span',
  size: null,
  imgClass: function(){
    let size = this.get('size');
    if (size) { return size; }

    return 'medium';
  }.property('size'),

  src: Ember.computed.alias('team.logoUrl')
});
