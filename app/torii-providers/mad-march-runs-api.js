import Ember from 'ember';
import config from '../config/environment';
import ajax from '../utils/ajax';

let url = config.apiHost + '/' + config.apiNamespace + '/' + config.tokenPath;

export default Ember.Object.extend({
  open: function(credentials){
    return ajax(url, {data:{user:credentials}, type:'POST'});
  }
});
