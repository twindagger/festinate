'use strict';

module.exports = function() {
  return {
    files: [
      '**/*.js',
      { pattern: '**/*.test.js', ignore: true }
    ],

    tests: [
      'test/**/*.test.js'
    ],

    env: {
      type: 'node',
      runner: 'node'
    },

    bootstrap: function() {
      // require('./test/_helper');
    }
  };
};