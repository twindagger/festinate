'use strict';

import Fester from '../';
// import { expect } from 'chai';


describe('Festinate', () => {
  let fester;
  let connection;
  before(() => {
    connection = {
      username: 'redrocket',
      password: 'kIb-oA-Hok-Uf-dUt-ac-Ar-E-or',
      server: 'redrocket.database.windows.net',
      database: 'adventureworks',
      encrypt: true
    };
    fester = new Fester(connection);
  });

  it('connects', (done) => {
    let map = {
      address1: { type: 'varchar', value: '450 W' },
      city: { type: 'varchar', value:'Ephraim' },
      province: { type: 'varchar', value: 'Utah' },
      country: { type: 'varchar', value: 'United States' },
      postalCode: { type: 'varchar', value: '84627' }
    };
    fester.executeSproc('SalesLT.create_address', map)
      .then((rows) => {
        console.log('test', rows);
        done();
      }).catch(done);
    // done();
  });
});
