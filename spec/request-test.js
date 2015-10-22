'use strict';

import { expect } from 'chai';
import proxy from 'proxyquire';

describe('request', () => {
  let Request;
  before(() => {
    Request = proxy('../lib/Request',{
      './types': () => {}
    });
  });

  describe('defaults', () => {
    it('throws an exception if sql string is not provided', () => {
      expect(() => {
        new Request();
      }).to.throw(/sql/);
    });
  });

  describe('addParameters', () => {
    let request;
    before(() => {
      request = new Request('do_something');
    });

    it('throws an exception if value is not provided', () =>{
      expect(() => {
        request.addParameters({ 'blah': { type: 'aha!' } });
      }).to.throw(/undefined/);
    });

    it('throws an exception if type is not provided', () => {
      expect(() => {
        request.addParameters({ 'blah': { value: 'aha!' } });
      }).to.throw(/undefined/);
    });
  });

  describe('addOutputParameters', () => {
    let request;
    before(() => {
      request = new Request('do_something');
    });

    it('throws an exception if value is not provided', () => {
      expect(() => {
        request.addOutputParameters({ 'blah': undefined });
      }).to.throw(/undefined/);
    });
  });
});
