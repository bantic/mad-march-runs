import Ember from 'ember';
import registerAcceptanceTestHelpers from './201-created/register-acceptance-test-helpers';
import Application from '../../app';
import config from '../../config/environment';
import createTestHelpers from './create-test-helpers';

export default function startApp(attrs) {
  let application;

  let attributes = Ember.merge({}, config.APP);
  attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

  Ember.run(() => {
    application = Application.create(attributes);
    application.setupForTesting();

    registerAcceptanceTestHelpers();
    createTestHelpers();

    application.injectTestHelpers();
  });

  return application;
}
