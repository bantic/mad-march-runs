import Ember from 'ember';
import { MAX_TEAMS } from '../models/user';

export default Ember.Controller.extend({
  userTeams: Ember.computed.alias('session.currentUser.teams'),

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
  }.property('userTeams.[]')
});
