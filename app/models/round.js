import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  isActive: DS.attr('boolean'),
  isInProgress: DS.attr('boolean'),
  isLocked: DS.attr('boolean'),

  games: DS.hasMany('games', {async:true})
});
