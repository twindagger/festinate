'use strict';
import { expect } from 'chai';
import proxy from 'proxyquire';
import sinon from 'sinon';

describe('Repository', () => {
  let repo;
  let rows = [];
  let more = false;
  let returnStatus = 0;
  let connectionConfig;
  let doneInProcSpy;
  let doneProcSpy;
  let closeSpy;

  beforeEach(() => {
    rows = [];
    more = false;
    returnStatus = 0;
    doneInProcSpy = sinon.spy();
    doneProcSpy = sinon.spy();
    closeSpy = sinon.spy();
    connectionConfig = {
      username: 'user1',
      password: 'secure',
      server: 'herp.derp.com',
      database: 'test'
    };
  });

  describe('spies', () => {
    let sprocObject;

    beforeEach(() => {
      sprocObject = {
        name: {
          value: 'bob',
          type: 'nvarchar'
        },
        age: {
          value: 7,
          type: 'int'
        }
      };
      let Connection = () => {
        return {
          close: closeSpy,
          on: (type, cllbk) => { cllbk(); },
          callProcedure: (request) => {
            request.on('doneInProc', doneInProcSpy);
            request.on('doneProc', doneProcSpy);
          }
        };
      };
      let Request = () => {
        return {
          on: (type, cllbk) => {
            if(type === 'doneInProc'){
              cllbk(rows.length, more, rows);
            } else if(type === 'doneProc'){
              cllbk(rows.length, more, returnStatus, rows);
            }
          },
          addParameters: () => {}
        };
      };

      let Repo = proxy('../lib/Repository', {
        'tedious': {
          Connection: Connection
        },
        './Request': Request,
        './logger': () => { return { log: () => {}, debug: () => {} }; }
      });
      repo = new Repo(connectionConfig);
      rows = [];
      more = false;
      returnStatus = 0;
      doneInProcSpy = sinon.spy();
      doneProcSpy = sinon.spy();
      closeSpy = sinon.spy();
    });

    it('executeSproc - can run through the whole process and call all events and close the connection', (done) => {
      repo.executeSproc('name', sprocObject)
      .then(() => {
        expect(doneInProcSpy.called).to.be.true;
        expect(doneProcSpy.called).to.be.true;
        expect(closeSpy.called).to.be.true;
        done();
      }).catch(done);
    });
  });

  describe('executeSproc', () => {
    var sprocObject;
    beforeEach(() => {
      sprocObject = {
        name: {
          value: 'bob',
          type: 'nvarchar'
        },
        age: {
          value: 7,
          type: 'int'
        }
      };
      let Connection = () => {
        return {
          close: closeSpy,
          on: (type, cllbk) => { cllbk(); },
          callProcedure: () => { }
        };
      };
      let Request = () => {
        return {
          on: (type, cllbk) => {
            if(type === 'doneInProc'){
              cllbk(rows.length, more, rows);
            } else if(type === 'doneProc'){
              cllbk(rows.length, more, returnStatus, rows);
            }
          },
          addParameters: () => {}
        };
      };

      let Repo = proxy('../lib/Repository', {
        'tedious': {
          Connection: Connection
        },
        './Request': Request,
        './logger': () => { return { log: () => {}, debug: () => {} }; }
      });
      repo = new Repo(connectionConfig);
      rows = [];
      more = false;
      returnStatus = 0;
      closeSpy = sinon.spy();
    });

    it('filters metadata from the event return from doneInProc into a simple object', (done) =>{
      let nameCol = { value: 'bob', metadata: { colName: 'name' } };
      let ageCol = { value: 7, metadata: { colName: 'age' } };
      rows = [ [nameCol, ageCol] ];
      repo.executeSproc('name', sprocObject)
        .then((rows) => {
          expect(rows).to.be.ok;
          expect(rows).to.contain({ name: sprocObject.name.value, age: sprocObject.age.value });
          expect(closeSpy.called).to.be.true;
          done();
        })
        .catch(done);
    });
  });
});
