import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import { stubRequest } from '../helpers/fake-server';
import startApp from 'mad-march-runs/tests/helpers/start-app';

let roundId = 0;
let makeRound = (roundData) => {
  roundId++;
  let defaultRoundData = {
    id: roundId,
    name: `round ${roundId}`,
    team_ids: []
  };
  return Ember.$.extend(true, defaultRoundData, roundData);
};

let application;
let teams = [
  {id: 1, name: 'xavier', seed: 1},
  {id: 2, name: 'villanova', seed: 2},
  {id: 3, name: 'florida gulf coast', seed: 3},
  {id: 4, name: 'UNC', seed: 16}
];
let games = [
  {id: 1, team_ids: [1,2]},
  {id: 2, team_ids: [3,4]}
];
let gameTeams = [
  [teams[0], teams[1]], // game 1
  [teams[2], teams[3]], // game 2
];
let rounds = [
  makeRound({name: 'round 1', game_ids:[1]}),
  makeRound({name: 'round 2', game_ids:[2]})
];

let makeUser = (userData) => {
  let defaultUserData = {
    id: 1, name: 'bob', canSelectTeams: true, teams: []
  };
  return Ember.$.extend(true, defaultUserData, userData);
};

module('Acceptance: Picks', {
  beforeEach: function() {
    application = startApp();
    stubRequest('get', 'api/rounds', function(request){
      return this.success({
        rounds,
        games,
        teams
      });
    });
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('visiting /picks shows rounds', function(assert) {
  signIn(makeUser());
  visit('/picks');

  andThen( () => {
    for (let i=0; i < rounds.length; i++) {
      let round = rounds[i];

      expectElement(`.round:eq(${i})`);
      expectElement(`.round:eq(${i}):contains(${round.name})`);

      let roundEl = find(`.round:eq(${i})`);
      let teams = gameTeams[i];

      let matchups = find(`.matchup`, roundEl);
      assert.equal(matchups.length, round.game_ids.length,
                   'has correct number of matchups for round');

      for (let j=0; j < teams.length; j++) {
        let teamEl = find(`.team:contains(${teams[i].name})`, roundEl);
        assert.ok(teamEl.length,
           `has team with name ${teams[i].name} in round ${round.name}`);
      }
    }
  });
});

test('visiting /picks and clicking a game allows selection', function(assert){
  let postedPick;
  let teams = gameTeams[0];
  let roundEl, matchupEl;

  stubRequest('post', 'api/picks', function(request){
    postedPick = this.json(request);
    return this.success({});
  });

  let userData = makeUser({id:'user1'});
  signIn(userData);
  visit('/picks');

  andThen( () => {
    roundEl   = findWithAssert(`.round:eq(0)`);
    matchupEl = findWithAssert(`.matchup:eq(0)`, roundEl);
    let button = findWithAssert(`.btn.select-matchup`, matchupEl);

    click(button);
  });

  andThen( () => {
    let pickEl = find(`.pick-winner`, matchupEl);
    assert.ok(pickEl.length, 'there is a pickEl');

    for (let i=0; i<teams.length; i++) {
      let button = find(`.select-winner:contains(${teams[i].name})`, matchupEl);
      assert.ok(button.length,
                `has button to select winner ${teams[i].name}`);
    }

    click(`.select-winner:contains(${teams[0].name})`);
  });

  andThen( () => {
    assert.ok(!!postedPick, 'posted pick JSON');
    assert.equal(postedPick.pick.game_id, games[0].id,
                 'json has game id');
    assert.equal(postedPick.pick.team_id, teams[0].id);
    assert.equal(postedPick.pick.user_id, userData.id);
  });
});
