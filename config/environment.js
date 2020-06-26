'use strict';

module.exports = function (/* environment, appConfig */) {
  return {
    APP: {
      'ember-foxy-forms': {
        testingClassPrefix: '--',
        fieldClasses: 'field',
        formClasses: 'form',
        fieldForControlCalloutClasses: 'field-for-control-callout',
        fieldForControlCalloutPosition: 'bottom left',

        buttonClasses: '',
        submitButtonClasses: '',
        resetButtonClasses: '',

        customCommitCancelComponent: null,
        customErrorComponent: null,

        controlsFolder: 'form-controls',
        controlPrefix: 'ff-',
      },
    },
  };
};
