import Ember from 'ember';
import layout from '../templates/components/countdown-timer';
import config from '../config/environment';

export default Ember.Component.extend({
  tagName: 'span',
  classNames: ['countdown-timer'],
  time: null,
  layout: layout,
  showMinutes: true,
  showSeconds: true,

  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,

  didInsertElement() {
    this._super(...arguments);
    this.started = true;
    if (config.environment !== 'test') {
      this.tick();
    }
  },

  willDestroyElement() {
    this._super(...arguments);
    if (this.timer) {
      Ember.run.cancel(this.timer);
      this.timer = null;
    }
  },

  tick: function(){
    if (!this.started) { return; }
    if (this.isDestroyed) { return; }

    let time = this.get('time');
    if (!time) { return; }

    let now = new Date().getTime();
    let remainingMs = time - now;

    let days = 0, hours = 0, minutes = 0, seconds = 0;

    if (remainingMs > 0) {
      days = Math.floor(remainingMs / (1000*(60*60*24)));
      remainingMs = remainingMs - (days*1000*(60*60*24));

      hours = Math.floor(remainingMs / (1000*3600));
      remainingMs = remainingMs - (hours*1000*3600);

      minutes = Math.floor(remainingMs / (1000*60));
      remainingMs = remainingMs - (minutes*1000*60);

      seconds = Math.floor(remainingMs/1000);
    }

    this.setProperties({
      days, hours, minutes, seconds
    });

    Ember.run.later(this, 'tick', 1000);
  }
});
