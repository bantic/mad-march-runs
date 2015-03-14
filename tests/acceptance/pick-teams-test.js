import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import { stubRequest } from '../helpers/fake-server';
import startApp from 'mad-march-runs/tests/helpers/start-app';

let application;
let teams = [
  {id: 1, name: 'xavier', seed: 1},
  {id: 2, name: 'villanova', seed: 2},
  {id: 3, name: 'florida gulf coast', seed: 3},
  {id: 4, name: 'UNC', seed: 16}
];

module('Acceptance: PickTeams', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('visiting /pick-teams with no teams', function(assert) {
  // 2 per team + 5 element assertions + 1 assertion for ajax
  assert.expect(teams.length*2 + 5 + 1);
  let userData = {id: 1, name: 'bob', teams: [] };

  stubRequest('get', 'teams', function(request){
    assert.ok(true, 'gets teams');
    return this.success({teams});
  });

  signIn(userData);
  visit('/pick-teams');

  andThen(function() {
    assert.equal(currentPath(), 'pick-teams');

    // 3 empty slots
    expectElement('.selected-teams .team.empty:eq(0)');
    expectElement('.selected-teams .team.empty:eq(1)');
    expectElement('.selected-teams .team.empty:eq(2)');

    expectElement('.teams');

    teams.forEach( (team, index) => {
      let teamDiv = find(`.teams .team:eq(${index})`);
      assert.ok( teamDiv.find(`.name:contains(${team.name})`).length,
                 `team div contains name ${team.name}`);
      assert.ok( teamDiv.find(`.seed:contains(${team.seed})`).length,
                 `team div contains seed ${team.seed}`);
    });
  });
});

test('visiting /pick-teams shows users selected teams', function(assert) {
  let userTeams = teams.slice(0,3);
  let userTeamIds = userTeams.map( (t) => t.id );
  let userData = {
    id: 1,
    name: 'bob',
    teams: userTeamIds
  };

  stubRequest('get', 'teams', function(request){
    return this.success({teams});
  });

  signIn(userData);
  visit('/pick-teams');

  andThen(function() {
    for (let i=0; i<userTeams.length; i++) {
      let team = userTeams[i];
      expectElement(`.selected-teams .team:eq(${i}) .name:contains(${team.name})`);
      expectElement(`.selected-teams .team:eq(${i}) .seed:contains(${team.seed})`);
    }
  });
});

/*
test('visiting /pick-teams with none selecting and picking', function(assert){
  let userData = {
    id: 1,
    name: 'bob',
    teams: []
  };

  stubRequest('get', 'teams', function(request){
    return this.success({teams});
  });

  signIn(userData);
  visit('/pick-teams');

});
*/
