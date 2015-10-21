'use strict';

import Fester from '../lib';
import { expect } from 'chai';


describe('Festinate', () => {
  let connection;

  describe('defaults', () => {
    beforeEach(() => {
      connection = {
        username: 'redrocket',
        password: 'hoop-a-doop',
        server: 'redrocket.database',
        database: 'adventureworks',
        encrypt: true
      };
    });

    it('throws an exception if no username is provided', () => {
      delete connection.username;
      expect(() => {
        new Fester(connection);
      }).to.throw(/username/);
    });
    it('throws an exception if no password is provided', () => {
      delete connection.password;
      expect(() => {
        new Fester(connection);
      }).to.throw(/password/);
    });
    it('throws an exception if no server address is provided', () => {
      delete connection.server;
      expect(() => {
        new Fester(connection);
      }).to.throw(/server/);
    });
  });
});
