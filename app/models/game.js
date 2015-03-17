import DS from 'ember-data';

export default DS.Model.extend({
  round: DS.belongsTo('round', {async:true}),
  teams: DS.hasMany('team', {async:true})
});
