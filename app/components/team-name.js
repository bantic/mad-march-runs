import Ember from 'ember';
import layout from '../templates/components/team-name';

export default Ember.Component.extend({
  layout: layout,
  tagName: 'span',
  classNames: ['team-name'],
  classNameBindings: ['eliminated'],

  team: null,
  eliminated: Ember.computed.reads('team.isEliminated')
});
