import Ember from 'ember';
import layout from '../templates/components/team-logo';

export default Ember.Component.extend({
  layout: layout,
  team: null,
  tagName: 'span',
  size: null,
  imgClass: Ember.computed.alias('size'),
  src: Ember.computed.alias('team.logoUrl')
});
