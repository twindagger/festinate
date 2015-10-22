'use strict';

import types  from '../lib/types';
import { expect } from 'chai';

describe('type', () => {
  it("throws an exception if a type isn't found", () => {
    expect(() => {
      types('bla');
    }).to.throw(/type/);
  });

  it('does not throw an exception for a found type', () => {
    expect(() => {
      types('bit');
    }).to.not.throw();
  });
});
