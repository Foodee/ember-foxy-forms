'use strict';

module.exports = function (environment) {
  let ENV = {
    modulePrefix: 'dummy',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false,
      },
    },

    APP: {
      'ember-foxy-forms': {
        testingClassPrefix: '--',
        fieldClasses: 'field',
        formClasses: 'form',
        bemClassPrefix: 'rd-',
        useBemClass: false,
        fieldForControlCalloutClasses: 'field-for-control-callout',
        fieldForControlCalloutPosition: 'bottom left',

        buttonClasses: 'a-button',
        buttonActingClass: 'acting',
        submitButtonClasses: 'submit',
        resetButtonClasses: 'reset',
        destroyButtonClasses: 'destroy',

        customCommitCancelComponent: null,
        customErrorComponent: null,

        controlsFolder: 'form-controls',
        controlPrefix: 'ff-',
      },
    },
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // Allow ember-cli-addon-docs to update the rootURL in compiled assets
    ENV.rootURL = 'ADDON_DOCS_ROOT_URL';
    // here you can enable a production-specific feature
  }

  return ENV;
};
