'use strict';

module.exports = function() {
  return {
    files: [
      'lib/**/*.js',
      'test/**/*.js',
      { pattern: '**/*.test.js', ignore: true }
    ],

    tests: [
      '**/*.test.js'
    ],

    env: {
      type: 'node',
      runner: 'node'
    },

    bootstrap: function() {
      require('./test/helper');
    }
  };
};