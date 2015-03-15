import DS from 'ember-data';
import config from '../config/environment';
import storage from '../utils/storage';

export default DS.ActiveModelAdapter.extend({
  host: config.apiHost,
  namespace: config.apiNamespace,

  headers: function(){
    let headers = {};
    let token = storage.read(config.authTokenKey);

    if (token) {
      headers['Authorization'] =
        `Token token=${token.token}, email=${token.email}`;
    }

    return headers;
  }.property().volatile()
});
