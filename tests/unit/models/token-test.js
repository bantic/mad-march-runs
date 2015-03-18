import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('token', {
  // Specify the other units that are required for this test.
  needs: ['model:user', 'model:team','model:pick']
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
