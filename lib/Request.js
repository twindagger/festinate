'use strict';

import { Request as TediousRequest } from 'tedious';
import Logger from './logger';
import lazy from 'lazy.js';
import assert from 'fluent-assert';
import getType from './types';

let logger = Logger('Request');

export default class Request extends TediousRequest {
  constructor(sql) {
    super(sql, (err, rowCount) => {
      if (err) {
        throw (err);
      }
      logger.debug('RowCount: %o', rowCount);
    });
    if (!sql) {
      throw new Error('Must provide something that can be executed via sql');
    }
  }

  /**
   * Adds parameters to the request
   * @param {object} params The object to create
   */
  addParameters(params) {
    lazy(params)
      .each((metadata, key) => {
        assert.ok('type', metadata.type);
        //Allow anything but undefined, including null...
        assert.ok('value', metadata.value === undefined ? undefined : 1);
        let type = getType(metadata.type);
        logger.debug('Adding parameter for %s', key);
        super.addParameter(key, type, metadata.value);
      });
  }

  /**
   * Adds output parameters to return only specified variables when the request completes
   * @param {object} params - an object of objects
   *   - { name: NVARCHAR }
   */
  addOutputParameters(params) {
    lazy(params)
      .each((type, param) => {
        logger.debug('Adding outputParam for %s', param);
        assert.ok('type', type);
        let foundType = getType(type);
        super.addOutputParameter(param, foundType);
      });
  }
}
