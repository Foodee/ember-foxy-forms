'use strict';

module.exports = function (/* environment, appConfig */) {
  return {
    APP: {
      'ember-foxy-forms': {
        testingClassPrefix: '--',
        fieldClasses: 'field',
        formClasses: 'form',
        bemClassPrefix: '',
        useBemClass: false,
        fieldForControlCalloutClasses: 'field-for-control-callout',
        fieldForControlCalloutPosition: 'bottom left',

        buttonClasses: '',
        buttonActingClass: '',
        submitButtonClasses: '',
        resetButtonClasses: '',
        destroyButtonClasses: '',

        customCommitCancelComponent: null,
        customErrorComponent: null,
        customButtonComponent: null,
        customLabelComponent: null,
        customInfoTextComponent: null,

        controlsFolder: 'form-controls',
        controlPrefix: 'ff-',
        formActionDebounce: 200,
      },
    },
  };
};
