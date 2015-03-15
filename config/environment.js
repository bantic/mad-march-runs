/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'mad-march-runs',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    contentSecurityPolicy: {
      'style-src': "'self' 'unsafe-inline'",
      'script-src': "'self' 'unsafe-inline'",
      "connect-src": "'self' http://localhost:3000 ws://localhost:35729 ws://0.0.0.0:35729"
    },

    torii: {
      sessionServiceName: 'session'
    },

    apiHost: 'http://localhost:3000',
    apiNamespace: 'api',
    tokenPath: 'tokens',
    authTokenKey: 'mmr-auth-token'
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.apiHost = '';
    ENV.authTokenKey = 'mmr-auth-token-test';
  }

  if (environment === 'production') {
    ENV.apiHost = 'http://mad-march-runs-api.herokuapp.com';
  }

  return ENV;
};
