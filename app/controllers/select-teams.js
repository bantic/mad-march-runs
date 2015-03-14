import Ember from 'ember';
import { MAX_TEAMS } from '../models/user';

export default Ember.Controller.extend({
  user: Ember.computed.alias('session.currentUser'),
  userTeams: Ember.computed.alias('user.teams'),

  // did the user change any selections?
  changedSelections: false,

  showSaveSelections: function(){
    return this.get('changedSelections') &&
      this.get('userTeams.length') > 0;
  }.property('changedSelections', 'userTeams.length'),

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

  actions: {
    selectTeam(team) {
      this.set('changedSelections', true);
      let user = this.get('user');
      user.get('teams').pushObject(team);
    },
    removeTeam(team) {
      this.set('changedSelections', true);
      let user = this.get('user');
      user.get('teams').removeObject(team);
    },
    saveSelections(){
      let user = this.get('user');
      user.save().then( () => {
        this.set('changedSelections', false);
      });
    }
  }
});
