import config from '../config/environment';
export function initialize(/* container, application */) {
  if (window.Rollbar && config.environment !== 'production'){
    window.Rollbar.configure({enabled:false});
  }
}

export default {
  name: 'exception-tracking',
  initialize: initialize
};
