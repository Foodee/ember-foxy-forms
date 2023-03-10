'use strict';

module.exports = function (/* environment, appConfig */) {
  return {
    APP: {
      'ember-foxy-forms': {
        testingClassPrefix: '--',
        fieldClasses: 'field',
        submittingClasses: 'submitting',
        formClasses: 'form',
        bemClassPrefix: '',
        useBemClass: false,
        gridTemplatePrefix: '',
        useGridTemplate: false,
        fieldForControlCalloutClasses: 'field-for-control-callout',
        fieldForControlCalloutPosition: 'bottom left',
        showRequiredIndicator: true,
        requiredText: '*',

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
      },
    },
  };
};
