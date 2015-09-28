'use strict';

let chai = require('chai');
let expect = chai.expect;
let Festernate = require('../');
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
    fester.select("SalesLT.Product", '*')
      .then(function(cols){
        // lazy(cols).each(() => {
        //
        // });
        console.log(cols);
        cols.forEach((col) => {
          console.log(col.value);
        });
        done();
      }).catch(done);
  });
});
