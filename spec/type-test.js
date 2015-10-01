'use strict';

import getType from '../src/types';
import { expect } from 'chai';

describe('type', () => {
  it("throws an exception if a type isn't found", () => {
    expect(() => {
      getType('bla');
    }).to.throw(/type/);
  });

  it('does not throw an exception for a found type', () => {
    expect(() => {
      getType('bit');
    }).to.not.throw();
  });
});
