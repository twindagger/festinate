'use strict';

import tedious from 'tedious';
import assert from 'fluent-assert';

import Logger from './logger';
import Request from './Request';

let logger = Logger('repository');
let Connection = tedious.Connection;

let connectionOptions;

class Repository {
  /**
   * This library allows a user to connect to a sql database
   * as well as execute stored procedures and sql statements
   * @constructor
   * @param  {object} connectionSettings The connection object to connect to a SQL database
   */
  constructor(connectionSettings) {
    assert.string('connectionSettings.username', connectionSettings.username);
    assert.string('connectionSettings.password', connectionSettings.password);
    assert.string('connectionSettings.server', connectionSettings.server);
    assert.string('connectionSettings.database', connectionSettings.database);
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

  /**
   * Executes a given SQL stored procedure
   * This will create a connection if one does not exist
   * @param  {string} sprocName   The name of the sproc to be executed
   * @param  {object} sprocObject The data that is meant to be saved
   * @param  {object} outParams   Filters what properties are returned
   * @return {promise}
   */
  async executeSproc(sprocName, sprocObject, outParams){
    assert.string('sprocName', sprocName);
    let connection = await this.connect();
    return new Promise((resolve, reject) => {
      var request;
      try {
        request = new Request(`${sprocName}`);
      } catch(e){
        return reject(e);
      }
      request.addParameters(sprocObject);
      request.addOutputParameters(outParams);
      request.on('doneProc', (rowcount, more, status, rows) => {
        logger.debug('doneProc: %o', rows);
        resolve(rows);
      });
      connection.callProcedure(request);
    });
  }

  /**
   * Allows you to execute a SQL statement
   * This will create a connection if one does not exist
   * @param  {string} sql       The SQL statement
   * @param  {object} props     The data that should go along with the request
   * @param  {object} outParams The variables that should be returned
   * @return {promise}
   */
  executeSql(){
    throw new Error('Not implemented');
  }

  /**
   * Disposes the connection if there is one available
   * @return {undefined}
   */
  dispose(){
    if(this.connection){
      logger.debug('Disposing connection');
      this.connection.close();
      this.connection = undefined;
    }
  }

  /**
   * Opens the connection with SQL server
   * @return {promise} Returns the connection on resolve
   */
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
      connection.on('error', (err) => {
        reject(err);
      });
    });
  }
}

module.exports = Repository;
