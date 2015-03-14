/*global QUnit*/
import resolver from './helpers/resolver';
import {
  setResolver
} from 'ember-qunit';
import FakeServer from './helpers/fake-server';

setResolver(resolver);

QUnit.testStart( () => {
  FakeServer.start();
});

QUnit.testDone( () => {
  FakeServer.stop();
});
