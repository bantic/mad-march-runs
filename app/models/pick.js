import DS from 'ember-data';

export default DS.Model.extend({
  user: DS.belongsTo('user', {async:true}),
  game: DS.belongsTo('game', {async:true}),
  team: DS.belongsTo('team', {async:true})
});
