import Ember from 'ember';
import ajax from '../utils/ajax';

let sessionURL = 'sessions';

export default Ember.Route.extend({
  actions: {
    login: function(email, password){
      return ajax(sessionURL, {
        type: 'POST',
        data: {
          email: email,
          password: password
        }
      });
    }
  }
});
