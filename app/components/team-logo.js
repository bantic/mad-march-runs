import Ember from 'ember';
import layout from '../templates/components/team-logo';

export default Ember.Component.extend({
  layout: layout,
  team: null,
  src: Ember.computed.alias('team.logoUrl')
});
