'use strict';

import tedious from 'tedious';
import assert from 'fluent-assert';

import Logger from './logger';
let logger = Logger('repository');

let Connection = tedious.Connection;
let Request = tedious.Request;

let connectionOptions;

let addParameters = (request, sObject) =>{
  assert.object('request', request);
  assert.object('sprocObject', sObject);
  logger.debug('Adding types to the sql statement: %o', sObject);
  sObject.forEach((value, key)=>{
    console.log(value, key);
    assert.ok('value', value.value);
    assert.ok('type', value.type);
    request.addParameter(key, value.type, value.value);
  });
  return request;
};

class Repository {
  constructor(connectionSettings) {
    connectionOptions = {
      userName: connectionSettings.username,
      password: connectionSettings.password,
      server: connectionSettings.server,
      domain: connectionSettings.domain,
      options: {
        database: connectionSettings.database,
        port: connectionSettings.port,
        encrypt: connectionSettings.encrypt,
        rowCollectionOnRequestCompletion: true
      }
    };
    logger.debug(connectionOptions);
  }

  // EXEC set_address @address @city, { address: 'Bit', city: { type: 'VarChar', value: ''} }

  async execute(sprocName, sprocObject){
    assert.string('sprocName', sprocName);
    assert.object('sprocObject', sprocObject);
    let self = this;
    let connection = await this.connect();
    return new Promise((resolve, reject) => {
      let preRequest = new Request(`${sprocName}`, (err, rowCount, rows) => {
        if(err){
          logger.log(err);
          self.dispose();
          return reject(err);
        }
        return resolve(rows);
      });

      let request = addParameters(preRequest, sprocObject);

      connection.callProcedure(request);
    }).catch((err) => {
      logger.error(err.stack);
      self.dispose();
    });
  }

  dispose(){
    if(this.connection){
      logger.debug('Disposing connection');
      this.connection.close();
      this.connection = undefined;
    }
  }

  async connect() {
    let self = this;
    if(self.connection){
      logger.debug('Connection already established');
      return Promise.resolve(self.connection);
    }

    return new Promise((resolve, reject) => {
      logger.debug('Creating connection');
      let connection = new Connection(connectionOptions);
      connection.on('connect', function onConnect(err) {
        if(err){
          logger.log(err);
          return reject(err);
        }
        logger.debug('connected');
        self.connection = connection;
        resolve(connection);
      });
    });
  }
}

module.exports = Repository;
