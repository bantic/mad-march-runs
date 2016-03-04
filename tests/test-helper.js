/*global QUnit*/
import resolver from './helpers/resolver';
import {
  setResolver
} from 'ember-qunit';
import FakeServer from 'ember-cli-fake-server';
import { clearSession } from 'mad-march-runs/torii-adapters/mad-march-runs-api';

setResolver(resolver);

QUnit.testStart( () => {
  clearSession();
  FakeServer.start();
});

QUnit.testDone( () => {
  FakeServer.stop();
});
