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

module('Acceptance: SelectTeams', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('visiting /select-teams with no teams', function(assert) {
  // 2 per team + 5 element assertions + 1 assertion for ajax
  assert.expect(teams.length*3 + 5 + 1);
  let userData = {id: 1, name: 'bob', teams: [] };

  stubRequest('get', 'teams', function(request){
    assert.ok(true, 'gets teams');
    return this.success({teams});
  });

  signIn(userData);
  visit('/select-teams');

  andThen(function() {
    assert.equal(currentPath(), 'select-teams');

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
      assert.ok( teamDiv.find(`.btn:contains(Select)`).length,
                 `has select button for team @ ${index}`);
    });
  });
});

test('visiting /select-teams shows users selected teams', function(assert) {
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
  visit('/select-teams');

  andThen(function() {
    for (let i=0; i<userTeams.length; i++) {
      let team = userTeams[i];
      expectElement(`.selected-teams .team:eq(${i}) .name:contains(${team.name})`);
      expectElement(`.selected-teams .team:eq(${i}) .seed:contains(${team.seed})`);
      expectElement(`.selected-teams .team:eq(${i}) .btn.remove`);
    }
  });
});

test('visiting /select-teams with none selected and selecting', function(assert){
  let userData = {
    id: 1,
    name: 'bob',
    teams: []
  };

  stubRequest('get', 'teams', function(request){
    return this.success({teams});
  });

  let updatedUserJSON;
  stubRequest('put', 'users/:id', function(request){
    updatedUserJSON = this.json(request);
    return this.success({});
  });

  let findTeamSlot = (index) => find(`.selected-teams .team:eq(${index})`);

  signIn(userData);
  visit('/select-teams');
  andThen( () => {
    assert.ok(findTeamSlot(0).hasClass('empty'),
              'precond: selected team idx 0 is empty');
    expectNoElement(`.selected-teams .btn:contains(Save Selections)`);
    click('.teams .team:eq(0) .btn:contains(Select)');
  });
  andThen( () => {
    assert.ok(!findTeamSlot(0).hasClass('empty'),
              'selected team idx 0 is not empty');
    assert.ok(findTeamSlot(0).find(`.name:contains(${teams[0].name})`).length,
              'selected team slot 0 has selected team');
    expectElement(`.selected-teams .btn:contains(Save Selections)`);
    click(findTeamSlot(0).find(`.btn.remove`));
  });
  andThen( () => {
    assert.ok(findTeamSlot(0).hasClass('empty'));
    expectNoElement(`.selected-teams .btn:contains(Save Selections)`);

    click('.teams .team:eq(0) .btn:contains(Select)');
  });
  andThen( () => {
    let btnSelector = '.selected-teams .btn:contains(Save Selections)';
    expectElement(btnSelector);
    click(btnSelector);
  });
  andThen( () => {
    assert.ok(updatedUserJSON, 'updated user');
    assert.deepEqual(updatedUserJSON.user.teams, [ ''+teams[0].id ],
                 'updates with team id');
  });
});
