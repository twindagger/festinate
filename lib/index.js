'use strict';

let co = require('co');
let Connection = require('tedious').Connection;
let Sql = require('sql-query');
let Query = Sql.Query;


class Repository {

  constructor(connectionSettings) {
    this._connect(connectionSettings);
  }

  insert(table, data) {

  }

  update(table, primaryKey, data) {

  }

  delete(table, primaryKey) {

  }

  _connect(connectionSettings) {
    var self = this;
    co(function* () {
      self.connection = yield self._createConnection(connectionSettings);
    });
  }

  _createConnection(connectionSettings) {
    return new Promise((resolve, reject) => {
      let connection = new Connection({
        userName: connectionSettings.userName,
        password: connectionSettings.password,
        server: connectionSettings.server,
        domain: connectionSettings.domain,
        options: {
          database: connectionSettings.database
        }
      });
      connection.on('connect', (err) => {
        if (err) {
          return reject(err);
        }
        return resolve(connection);
      });
    });
  }
}

module.exports = Repository;