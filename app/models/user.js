import DS from 'ember-data';

export const MAX_TEAMS = 3;

export default DS.Model.extend({
  name: DS.attr('string'),
  email: DS.attr('string'),
  password: DS.attr('string'),
  isAdmin: DS.attr('boolean'),

  canSelectTeams: DS.attr('boolean'),
  teams: DS.hasMany('team', {async:true})
});
