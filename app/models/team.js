import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  seed: DS.attr('number'),
  region: DS.attr('string'),
  logoUrl: DS.attr('string'),
  isEliminated: DS.attr('boolean')
});
