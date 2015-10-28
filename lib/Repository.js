'use strict';

import { Connection } from 'tedious';
import assert from 'fluent-assert';

import Logger from './logger';
import Request from './Request';
import lazy from 'lazy.js';

let logger = Logger('repository');

let connectionOptions;

export default class Repository {
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
        rowCollectionOnDone: true
      }
    };
    logger.debug(connectionOptions);
  }

  /**
   * Executes a given SQL stored procedure
   * This creates a connection on every request
   * @param  {string} sprocName   The name of the sproc to be executed
   * @param  {object} sprocObject The data that is meant to be saved
   * @return {promise}
   */
  executeSproc(sprocName, sprocObject){
    assert.string('sprocName', sprocName);
    var request;
    var results = [];
    return new Promise((resolve, reject) => {
      let connection = new Connection(connectionOptions);
      connection.on('connect', function onConnect(err) {
        if(err){
          logger.log(err);
          return reject(err);
        }
        logger.debug('connected');

        try {
          request = new Request(`${sprocName}`);
        } catch(e){
          return reject(e);
        }

        request.addParameters(sprocObject);

        request.on('doneInProc', (rowCount, more, rows) => {
          logger.debug('doneInProc: %o', rows);
          logger.debug('more: %o', more);
          // TODO: This may want to be pulled out at a later time
          lazy(rows).each((row) => {
            var newCol = {};
            lazy(row).each((col) => {
              let colName = col.metadata.colName;
              newCol[colName] = col.value;
            });
            results.push(newCol);
          });
        });

        request.on('doneProc', (rowCount, more, returnStatus, rows) => {
          logger.debug('doneProc', rowCount, more, returnStatus, rows);
          connection.close();
          resolve(results);
        });

        connection.callProcedure(request);
      });

      connection.on('error', (err) => {
        connection.close();
        reject(err);
      });
    });
  }

  /**
   * Allows you to execute a SQL statement
   * @param  {string} sql       The SQL statement
   * @param  {object} props     The data that should go along with the request
   * @return {promise}
   */
  executeSql(){
    throw new Error('Not implemented');
  }
}
