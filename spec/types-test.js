'use strict';

let chai = require('chai');
let types = require('../src/types');
let lazy = require('lazy.js');

let assert = chai.assert;

describe('types', () => {
  // Just makes sure no type is miss typed
  it('each type has a type and id variable', () => {
    lazy(types).each((value) => {
      assert.ok(value.type);
      assert.ok(value.id);
    });
  });
});
