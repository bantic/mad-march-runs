import {
  moduleForModel,
  test
} from 'ember-qunit';
import Ember from 'ember';
import { stubRequest } from 'ember-cli-fake-server';

moduleForModel('user', {
  // Specify the other units that are required for this test.
  needs: ['model:team','adapter:application','serializer:user','model:pick','model:game','model:round']
});

test('serializes team ids', function(assert) {
  let store = this.store();
  let team, user;

  stubRequest('put', '/api/users/1', function(request){
    assert.ok(true);
    let json = this.json(request);
    assert.deepEqual(json.user.team_ids, ['2']);
    return this.success({});
  });

  Ember.run( () => {
    team = store.push('team', {id:2, name:'nova'});
    user = store.push('user', {id:1,name:'bob', teams:[]});
  });

  return Ember.run( () => {
    user.get('teams').pushObject(team);
    return user.save();
  });
});
