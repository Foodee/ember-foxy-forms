/*jshint node:true*/
'use strict';

module.exports = function (/* environment, appConfig */) {
  return {
    APP: {
      'ember-form-for': {
        fieldClasses: 'field',
        formClasses: 'form',
        popOverClass: '',

        buttonClasses: '',
        submitButtonClasses: '',
        resetButtonClasses: '',

        customCommitCancelComponent: null,
        customErrorComponent: null
      }
    }
  };
};
