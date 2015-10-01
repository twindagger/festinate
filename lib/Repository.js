'use strict';

import tedious from 'tedious';
import assert from 'fluent-assert';
import lazy from 'lazy.js';

import Logger from './logger';
let logger = Logger('repository');

let Connection = tedious.Connection;
let Request = tedious.Request;

let connectionOptions;

var addParameters = (request, sObject) => {
  if(!sObject) {
    logger.debug('sproc object was not defined.');
    return;
  }
  assert.object('request', request);
  logger.debug('Adding types to the sql statement: %o', sObject);
  lazy(sObject).each((value, key) => {
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
        rowCollectionOnDone: true,
        rowCollectionOnRequestCompletion: true
      }
    };
    logger.debug(connectionOptions);
  }

  get connectionSettings(){
    return connectionOptions;
  }

  async executeSproc(sprocName, sprocObject){
    assert.string('sprocName', sprocName);
    let self = this;
    let connection = await this.connect();
    return new Promise((resolve, reject) => {
      var plainRequest = new Request(`${sprocName}`, (err) => {
        if(err){
          logger.log(err);
          self.dispose();
          return reject(err);
        }
      });
      plainRequest.on('doneProc', (rowcount, more, status, rows) => {
        resolve(rows);
        console.log('done', rows);
      });
      let parameterizedRequest = addParameters(plainRequest, sprocObject);
      connection.callProcedure(parameterizedRequest || plainRequest);
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
