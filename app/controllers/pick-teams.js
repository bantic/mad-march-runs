import Ember from 'ember';
import { MAX_TEAMS } from '../models/user';

export default Ember.Controller.extend({
  userTeams: Ember.computed.alias('session.currentUser.teams'),

  teamSlots: function(){
    let slots = [],
        userTeams = this.get('userTeams') || [];
    for (let i=0; i < MAX_TEAMS; i++) {
      slots.push( {team: userTeams.objectAt(i)} );
    }
    return slots;
  }.property('userTeams.[]')
});
