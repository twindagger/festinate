'use strict';

// let chai = require('chai');
// let expect = chai.expect;
import Fester, { types } from '../';

// let tedious = require('tedious');
// let types = tedious.TYPES;
// let lazy = require('lazy');


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

  // it('should succeed', () => {
  //   expect(true).to.be.ok;
  // });

  it('connects', (done) => {
    let map = {
      address1: { type: types.varchar, value: '450 W' },
      city: { type: types.varchar, value:'Ephraim' },
      province: { type: types.varchar, value: 'Utah' },
      country: { type: types.varchar, value: 'United States' },
      postalCode: { type: types.varchar, value: '84627' }
    };
    fester.executeSproc('SalesLT.create_address', map)
      .then((rows) => {
        console.log('test', rows);
        // rows.forEach((row) => {
        //   console.log(row);
        //   // row.forEach((col) =>{
        //   //   console.log(col.value);
        //   // });
        // });
        done();
      }).catch(done);
    // done();
  });
});
