/* globals blanket, module */

var options = {
  modulePrefix: 'ember-form-for',
  filter: '//.*ember-form-for/.*/',
  antifilter: '//.*(tests|template).*/',
  loaderExclusions: [],
  lcovOptions: {
    outputFile: 'lcov.dat',

    excludeMissingFiles: true
  },

  cliOptions: {
    reporters: ['lcov'],

    autostart: true,

    debugCLI: false
  }
};
if (typeof exports === 'undefined') {
  blanket.options(options);
} else {
  module.exports = options;
}
