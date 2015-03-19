import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import { stubRequest } from '../helpers/fake-server';
import startApp from 'mad-march-runs/tests/helpers/start-app';
import { MAX_TEAMS } from 'mad-march-runs/models/user';

let application;
let teams = [
  {id: 1, name: 'xavier', seed: 1},
  {id: 2, name: 'villanova', seed: 2},
  {id: 3, name: 'florida gulf coast', seed: 3},
  {id: 4, name: 'UNC', seed: 16}
];

let makeUser = (userData) => {
  let defaultUserData = {
    id: 1, name: 'bob', canSelectTeams: true, teams: []
  };
  return Ember.$.extend(true, defaultUserData, userData);
};

module('Acceptance: SelectTeams', {
  beforeEach: function() {
    application = startApp();
    stubRequest('get', 'api/teams', function(request){
      return this.success({teams});
    });
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('visiting /select-teams with no teams', function(assert) {
  // 2 per team + 5 element assertions
  assert.expect(teams.length*2 + 5);
  let userData = makeUser({teams:[]});

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
    });
  });
});

test('visiting /select-teams shows users selected teams', function(assert) {
  let userTeams = teams.slice(0,2);
  let userTeamIds = userTeams.map( (t) => t.id );
  let userData = makeUser({teams:userTeamIds});

  signIn(userData);
  visit('/select-teams');

  andThen(function() {
    for (let i=0; i<userTeams.length; i++) {
      let team = userTeams[i];
      expectElement(`.selected-teams .team:eq(${i}) .name:contains(${team.name})`);
      expectElement(`.selected-teams .team:eq(${i}) .seed:contains(${team.seed})`);

      // team in .teams list has selected class
      expectElement(`.teams .team:eq(${i}).selected`);
    }

    for (let i=userTeams.length; i<teams.length; i++) {
      let team = teams[i];
      let div = find(`.teams .team:eq(${i})`);
      assert.ok(!div.hasClass('selected'), 'team is not selected');
    }
  });
});

test('visiting /select-teams when user has selected MAX_TEAMS teams', function(assert) {
  let userTeams = teams.slice(0,MAX_TEAMS);
  let userTeamIds = userTeams.map( (t) => t.id );
  let userData = makeUser({teams:userTeamIds});

  signIn(userData);
  visit('/select-teams');

  let selectedTeamsText;
  andThen( () => {
    selectedTeamsText = find(`.selected-teams .team`).text();

    for(let i=userTeams.length; i<teams.length; i++){
      click(`.teams .team:eq(${i})`);
    }
  });

  andThen( () => {
    // sort of a weird way to test that it's not possible to add a 4th team
    assert.equal(selectedTeamsText,
                 find(`.selected-teams .team`).text(),
                 'selected teams text has not changed -- clicking is a no-op');
  });
});

// FIXME insert test here to test that clicking a selected team deselects it

test('visiting /select-teams with none selected and selecting', function(assert){
  let userData = makeUser({teams:[]});

  let updatedUserJSON;
  stubRequest('put', 'api/users/:id', function(request){
    updatedUserJSON = this.json(request);
    return this.success({});
  });

  let findTeamSlot = (index) => find(`.selected-teams .team:eq(${index})`);

  signIn(userData);
  visit('/select-teams');
  andThen( () => {
    assert.ok(findTeamSlot(0).hasClass('empty'),
              'precond: selected team idx 0 is empty');
    click('.teams .team:eq(0)');
  });
  andThen( () => {
    assert.ok(!findTeamSlot(0).hasClass('empty'),
              'selected team idx 0 is not empty');
    assert.ok(findTeamSlot(0).find(`.name:contains(${teams[0].name})`).length,
              'selected team slot 0 has selected team');
    expectElement(`.selected-teams .btn:contains(Save Selections)`);
    click(findTeamSlot(0));
  });
  andThen( () => {
    assert.ok(findTeamSlot(0).hasClass('empty'));
    expectElement(`.selected-teams .btn.save-selections.disabled`);

    click('.teams .team:eq(0)');
  });
  andThen( () => {
    let btnSelector = '.selected-teams .btn.save-selections';
    expectElement(btnSelector);
    click(btnSelector);
  });
  andThen( () => {
    assert.ok(updatedUserJSON, 'updated user');
    assert.deepEqual(updatedUserJSON.user.team_ids, [ ''+teams[0].id ],
                 'updates with team id');
  });
});
