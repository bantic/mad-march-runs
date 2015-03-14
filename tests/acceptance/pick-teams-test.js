import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import { stubRequest } from '../helpers/fake-server';
import startApp from 'mad-march-runs/tests/helpers/start-app';

var application;

module('Acceptance: PickTeams', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('visiting /pick-teams', function(assert) {
  let teams = [
    {id: 1, name: 'xavier', seed: 1},
    {id: 2, name: 'villanova', seed: 2},
    {id: 3, name: 'florida gulf coast', seed: 3},
    {id: 4, name: 'UNC', seed: 16}
  ];
  // 2 per team + 5 element assertions + 1 assertion for ajax
  assert.expect(teams.length*2 + 5 + 1);

  stubRequest('get', 'teams', function(request){
    assert.ok(true, 'gets teams');
    return this.success({
      teams: teams
    });
  });

  visit('/pick-teams');

  andThen(function() {
    assert.equal(currentPath(), 'pick-teams');

    expectElement('.selected-teams .team:eq(0)');
    expectElement('.selected-teams .team:eq(1)');
    expectElement('.selected-teams .team:eq(2)');

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
