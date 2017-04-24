/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-form-for',

  preBuild: function (result) {

    console.log('Hello from prebuild');
    console.log(JSON.stringify(result))

  }
};
