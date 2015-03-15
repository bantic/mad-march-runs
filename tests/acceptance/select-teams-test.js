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
  // 2 per team + 5 element assertions + 1 assertion for ajax
  assert.expect(teams.length*3 + 5);
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
      assert.ok( teamDiv.find(`.btn:contains(Select)`).length,
                 `has select button for team @ ${index}`);
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
      expectElement(`.selected-teams .team:eq(${i}) .btn.remove`);

      expectElement(`.teams .team:eq(${i}) .btn.select:disabled`);
      expectElement(`.teams .team:eq(${i}) .btn.select:disabled:contains(Selected)`);
    }

    for(let i=userTeams.length; i<teams.length; i++){
      let team = teams[i];

      let selectButton = find(`.teams .team:eq(${i}) .btn.select`);
      assert.ok(!selectButton.is(':disabled'), 'button is not disabled');

      assert.ok(selectButton.text().indexOf('Selected') === -1,
                'button does not contain selected text');
      assert.ok(selectButton.text().indexOf('Select') > -1,
                'button does contain selected text');
    }
  });
});

test('visiting /select-teams when user has selected MAX_TEAMS teams', function(assert) {
  let userTeams = teams.slice(0,MAX_TEAMS);
  let userTeamIds = userTeams.map( (t) => t.id );
  let userData = makeUser({teams:userTeamIds});

  signIn(userData);
  visit('/select-teams');

  andThen(function() {
    for(let i=userTeams.length; i<teams.length; i++){
      let team = teams[i];

      let selectButton = find(`.teams .team:eq(${i}) .btn.select`);
      assert.ok(selectButton.is(':disabled'), 'button is disabled');
    }
  });
});

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
    assert.deepEqual(updatedUserJSON.user.team_ids, [ ''+teams[0].id ],
                 'updates with team id');
  });
});

test('visiting /select-teams when user cannot select redirects to index', function(assert){
  let userData = makeUser({canSelectTeams:false});

  signIn(userData);
  visit('/select-teams');
  andThen( () => {
    assert.equal(currentPath(), 'index');
  });
});
