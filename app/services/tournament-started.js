import Ember from 'ember';
import config from '../config/environment';
let tournamentStartTime = config.tournamentStartTime;

export default Ember.Service.extend({
  started: false,

  startClock: function(){
    if (config.environment !== 'test') {
      this.tick();
    }
  }.on('init'),

  tick() {
    let tickLater = () => {
      let now = new Date().getTime();
      if (now > tournamentStartTime) {
        Ember.run(this, 'set', 'started', true);
      } else {
        setTimeout(tickLater, 30000);
      }
    };
    tickLater();
  }
});
