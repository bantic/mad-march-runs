import DS from 'ember-data';

export const MAX_TEAMS = 3;

export default DS.Model.extend({
  name: DS.attr('string'),
  teams: DS.hasMany('team', {async:true})
});
