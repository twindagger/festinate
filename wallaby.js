'use strict';

module.exports = function() {
  return {
    files: [
      'src/**/*.js',
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
    }
  };
};
