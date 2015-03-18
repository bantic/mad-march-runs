import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('pick', {
  // Specify the other units that are required for this test.
  needs: ['model:user','model:team','model:game','model:round']
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
