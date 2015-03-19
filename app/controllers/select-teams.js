import Ember from 'ember';
import { MAX_TEAMS } from '../models/user';
import config from '../config/environment';

export default Ember.Controller.extend({
  tournamentStartTime: config.tournamentStartTime,
  tournamentStartedService: Ember.inject.service('tournament-started'),
  tournamentStarted: Ember.computed.reads('tournamentStartedService.started'),

  user: Ember.computed.alias('session.currentUser'),
  userTeams: Ember.computed.alias('user.teams'),

  // did the user change any selections?
  changedSelections: false,

  isSavingSelections: false,

  hasEmptyTeamSlots: Ember.computed.lt('userTeams.length', MAX_TEAMS),

  showSaveSelections: function(){
    return this.get('changedSelections') &&
      this.get('userTeams.length') > 0;
  }.property('changedSelections', 'userTeams.length'),

  notShowSaveSelections: Ember.computed.not('showSaveSelections'),

  maxTeams: MAX_TEAMS,

  teamSlots: function(){
    let slots = [],
        userTeams = this.get('userTeams') || [];
    for (let i=0; i < userTeams.get('length'); i++) {
      slots.push( {team: userTeams.objectAt(i)} );
    }
    while (slots.length < MAX_TEAMS) {
      slots.push( {team: null} );
    }
    return slots;
  }.property('userTeams.[]'),

  // array of {region: X, teams: []}, teams sorted by seed
  groupedTeams: function(){
    let regions = {};
    let teams = this.get('model');
    let groupings = [];

    teams.forEach( (team) => {
      let region = team.get('region') || 'unknown';
      if (!regions[region]) { regions[region] = []; }
      regions[region].push(team);
    } );

    Ember.keys(regions).forEach( (region) => {
      let teams = regions[region];
      teams = teams.sortBy('seed');
      groupings.push( {teams: teams, region:region} );
    });

    return groupings;
  }.property('model.[]'),

  actions: {
    toggleSelect(team) {
      if (this.get('tournamentStarted')) { return; }

      let changed = false;

      let user = this.get('user');
      if (user.get('teams').contains(team)) {
        changed = true;
        user.get('teams').removeObject(team);
      } else {
        if (!this.get('hasEmptyTeamSlots')) { return; }
        changed = true;
        user.get('teams').pushObject(team);
      }
      this.set('changedSelections', changed);
    },

    saveSelections(){
      if (this.get('tournamentStarted')) { return; }

      let user = this.get('user');
      this.set('isSavingSelections', true);
      user.save().then( () => {
        this.set('changedSelections', false);
        this.set('isSavingSelections', false);
      });
    }
  }
});
