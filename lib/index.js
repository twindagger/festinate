'use strict';

import tedious from 'tedious';
import sql from 'sql-query';
import assert from 'fluent-assert';

let Connection = tedious.Connection;
let Request = tedious.Request;
let query = sql.Query();

let connectionOptions;

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
        encrypt: connectionSettings.encrypt
      }
    };
  }

  insert(table, data) {

  }

  update(table, primaryKey, data) {

  }

  delete(table, primaryKey) {

  }

  async select(table, id){
    assert.string('table', table);
    var self = this;
    // console.log('select being ran');
    let connection = await this.connect();
    let statement = query.select()
      .from(table)
      .build();
    statement = statement.replace('`', "").replace('`', "");

  console.log(statement);
    return new Promise((resolve, reject) => {
      // console.log('in select promise');
      let request = new Request(statement, (err, rowCount, rows) => {
        // console.log(err);
        console.log(rows);
        // resolve(rows);
      });
      console.log('executing request');
      request.on('done', function(rowCount, more, rows){
        // console.log(cols);
        console.log('yay');
        return resolve(rows);
      });
      connection.execSql(request);

    }).catch((err) => {
      console.error(err.stack);
    });
  }

  async connect() {
    // console.log('trying to connect');
    let self = this;
    if(self.connection){
      return Promise.resolve(self.connection);
    }

    return new Promise((resolve, reject) =>{
      let connection = new Connection(connectionOptions);
      connection.on('connect', function onConnect(err) {
        if(err){
          console.log(err);
          return reject(err);
        }
        console.log('connected');
        // await connection;
        self.connection = connection;
        resolve(connection);
      });
    });
  }
}

module.exports = Repository;
