'use strict';

// let chai = require('chai');
// let expect = chai.expect;
let Festernate = require('../');
let tedious = require('tedious');
let types = tedious.TYPES;
// let lazy = require('lazy');

describe('Festinate', () => {
  let fester;
  let connection;
  before(() => {
    connection = {
      username: 'redrocket',
      password: '',
      server: '',
      database: 'adventureworks',
      encrypt: true
    };
    fester = new Festernate(connection);
  });

  // it('should succeed', () => {
  //   expect(true).to.be.ok;
  // });

  it('connects', (done) => {
    let map = new Map([['address1', { type: types.VarChar, value: '450 W' }],['city', { type: types.VarChar, value:'Ephraim' }],['province', { type: types.VarChar, value: 'Utah' }],['country', { type: types.VarChar, value: 'United States' }],['postalCode', { type: types.VarChar, value: '84627' }]]);
    fester.execute('SalesLT.create_address', map)
      .then((rows) => {
        console.log(rows);
        // rows.forEach((row) => {
        //   console.log(row);
        //   // row.forEach((col) =>{
        //   //   console.log(col.value);
        //   // });
        // });
        done();
      }).catch(done);
  });
});
