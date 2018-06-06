import Ember from 'ember';
import layout from '../templates/components/form-for';

const {
  RSVP: {Promise},
  inject: {service},
  computed,
  get,
  getOwner,
  setProperties,
} = Ember;

const FormFor = Ember.Component.extend({

  layout,

  formFor: service(),

  router: service('-routing'),

  config: computed(function () {
    return Object.assign({}, getOwner(this).resolveRegistration('config:environment').APP['ember-foxy-forms']);
  }),

  // remove tags, so we don't interfere with styles that use direct inheritance
  tagName: 'div',

  classNames: ['form-for'],

  classNameBindings: ['config.formClasses', '_testingClass'],

  /**
   * Collection of all child field registered with this form
   * @property fields
   * @type FieldFor[]
   * @default null
   * @public
   */
  fields: null,

  /**
   * Model that this form controls
   * @property model
   * @type Ember.Object
   * @default null
   * @public
   */
  model: null,

  'model-name': null,

  /**
   * Whether or not any changes have been made to the model
   * @property isModelDirty
   * @type boolean
   * @default false
   * @public
   */
  isModelDirty: false,

  /**
   * Computed model name
   * @property _modelName
   * @type String
   * @default 'object'
   * @public
   */
  _modelName: computed('model', 'model-name', function () {
    const model = this.get('model');
    let modelName = 'object';

    if (model) {
      modelName = this.get('model-name') ||
        get(model, 'modelName') ||
        get(model, '_internalModel.modelName') ||
        'object';
    }

    return Ember.String.dasherize(modelName);
  }),

  /**
   * A class which will be appended to the form for testing purpose (not styling purposes)
   * @property _testingClass
   * @type String
   * @default '--field-for__<model-name>'
   * @private
   */
  _testingClass: computed('model', function () {
    return `${this.get('config.testingClassPrefix')}form-for__${this.get('_modelName')}`;
  }),


  /**
   * Base errors for the model
   * @property errors
   * @type Error[]
   * @default []
   * @public
   */
  errors: computed('model.errors.base', function () {
    return (this.get('model.errors.base') || [])
      .map(error => {
        error.message = error.message.replace(/base - /i, '');

        return error;
      });
  }),

  // --------------------------------------------------------------------------------
  // This section is where the DSL syntax lives

  /**
   * Whether or not this form is disabled
   * @property disabled
   * @type boolean
   * @default false
   * @public
   */
  disabled: false,

  /**
   * Whether or not this form is readonly
   * @property readonly
   * @type boolean
   * @default false
   * @public
   */
  readonly: false,

  /**
   * Whether or not this form is setup for inline editing
   * @property inline-editing
   * @type boolean
   * @default false
   * @public
   */
  'inline-editing': false,

  /**
   * Whether or not this form requires confirmation to apply values to
   * the model
   * @property requireConfirm
   * @type boolean
   * @default false
   * @public
   */
  'require-confirm': false,

  /**
   * Whether or not this form notifies of its success by way of the formFor service
   * @property notify-of-success
   * @type boolean
   * @default true
   * @public
   */
  'notify-of-success': true,

  /**
   * Whether or not this form notifies of its error by way of the formFor service
   * @property notify-of-error
   * @type boolean
   * @default true
   * @public
   */
  'notify-of-error': true,

  /**
   * The message to send on submit success
   * @property successful-submit-message
   * @type String
   * @default null
   * @public
   */
  'successful-submit-message': null,

  /**
   * The message to send on submit error
   * @property failed-submit-message
   * @type String
   * @default null
   * @public
   */
  'failed-submit-message': null,

  /**
   * The message to send on reset success
   * @property successful-reset-message
   * @type String
   * @default null
   * @public
   */
  'successful-reset-message': null,

  /**
   * The message to send on reset error
   * @property reset-error-message
   * @type String
   * @default null
   * @public
   */
  'failed-reset-message': null,

  /**
   * The message displayed to confirm destruction
   * @property confirm-destroy-message
   * @type String
   * @default null
   * @public
   */
  'confirm-destroy-message': null,

  /**
   * The message to send on destroy success
   * @property successful-destroy-message
   * @type String
   * @default null
   * @public
   */
  'successful-destroy-message': null,

  /**
   * The message to send on destroy error
   * @property failed-destroy-message
   * @type String
   * @default null
   * @public
   */
  'failed-destroy-message': null,

  /**
   * Whether or not the form automatically submits on value changes
   * @property auto-submit
   * @type Boolean
   * @default false
   * @public
   */
  'auto-submit': false,

  /**
   * Whether or not the form automatically prevents navigation when the model is dirty
   * @property prevents-navigation
   * @type Boolean
   * @default false
   * @public
   */
  'prevents-navigation': false,

  /**
   * Options to be passed to the validation if using validators
   * @property validation-options
   * @type Object
   * @default {}
   * @public
   */
  'validation-options': {},


  // --------------------------------------------------------------------------------
  // Methods
  //

  /**
   * Runs model validations if they are present
   * @method runValidations
   * @return {boolean}
   * @public
   */
  runValidations(validationOptions = null) {
    const model = this.get('model');
    return model.validate ? model.validate(validationOptions || this.get('validation-options')) : true;
  },

  /**
   * Clears the validations on the model
   * @method clearValidations
   * @public
   */
  clearValidations() {
    const model = this.get('model');
    return model.validate && model.validate({ only: [] });
  },

  /**
   * Called before the form submits, this is where we do
   * validation
   * @method willSubmit
   * @param {Object} [model]
   * @return {boolean}
   * @public
   */
  willSubmit() {
    return this.runValidations();
  },

  /**
   * Called when will submit returned false
   * @method didNotSubmit
   * @param {Object} [model]
   * @public
   */
  didNotSubmit() {
  },

  /**
   * Called when the submit action is called
   * @method onSubmit
   * @param {Object} model
   * @return {Promise.<Object>}
   * @public
   */
  onSubmit(model) {
    return model.save ? model.save() : Promise.resolve(model);
  },

  /**
   * Called when the onSubmit is fulfilled
   * @method didSubmit
   * @param {Object} model
   * @public
   */
  didSubmit(/*model*/) {
  },

  /**
   * Called when the onSubmit is rejected
   * @method failedSubmit
   * @param {Object} reason
   * @public
   */
  failedSubmit(/*reason*/) {
  },

  /**
   * Action that actual does the submitting
   * @method doSubmit
   * @public
   */
  doSubmit() {

    const model = this.get('model');
    const isSaving = get(model, 'isSaving');

    // Guard if the model is saving
    if (!isSaving && this.willSubmit(model)) {

      this.set('isSubmitting', true);

      return this.onSubmit(model)
        .then(() => {
          this.notifySuccess(this.get('successful-submit-message'));
          this.didSubmit();
          this._markClean();
          this._runFieldDidSubmit();
          this.set('_hasFailedToSubmit', false);
        })
        .catch(_ => {
          this.notifyError(this.get('failed-submit-message'));
          this.failedSubmit(_);
          return Promise.reject(_);
        })
        .finally(() => this.set('isSubmitting', false));
    }
    else {
      this.set('_hasFailedToSubmit', true);
      return Promise.resolve(true);
    }
  },

  /**
   * Called before the form resets
   * @method willReset
   * @param {Object} model
   * @return boolean
   * @public
   */
  willReset(/*model*/) {
    return true;
  },

  /**
   * Called when will reset returned false
   * @method didNotReset
   * @param {Object} model
   * @public
   */
  didNotReset(/*model*/) {
  },

  /**
   * Called when the reset action is called
   * @method onReset
   * @param {Object} [model]
   * @return {Promise.<Object>}
   * @public
   */
  onReset(model) {
    return Promise.resolve(model);
  },

  /**
   * Called when the onReset is fulfilled
   * @method didReset
   * @param {Object} model
   * @public
   */
  didReset(/*model*/) {
  },

  /**
   * Called when the onReset is rejected
   * @method failedReset
   * @param {Object} reason
   * @public
   */
  failedReset(/*reason*/) {
  },

  /**
   * Action that actual does the resetting
   * @method doReset
   * @public
   */
  doReset() {
    const model = this.get('model');

    if (this.willReset(model)) {

      this.set('isResetting', true);

      this.onReset()
        .then(() => {
          this.notifySuccess(this.get('successful-reset-message'));
          this.didReset();
          this._runFieldDidReset();
          this._markClean();
        })
        .catch(_ => {
          this.notifyError(this.get('failed-reset-message'));
          this.failedReset(_);
        })
        .finally(() => this.set('isResetting', false));
    }
  },


  /**
   * Called when the onDestroy is fulfilled
   * @method didDestroy
   * @public
   */
  didDestroy() {
  },


  /**
   * Called when the onDestroy is fulfilled
   * @method failedDestroy
   * @param {Object} reason
   * @public
   */
  failedDestroy(/* reason */) {
  },

  /**
   * Called to confirm the destruction of the model
   * @method confirmDestroy
   * @param {Object} model
   * @public
   */
  confirmDestroy(model) {
    this.set('isDestroyingRecord', true);
    this.get('formFor')
      .confirmDestroy(model, this.get('confirm-destroy-message'))
      .then(() => {
        this.notifySuccess(this.get('successful-destroy-message'));
        this.didDestroy();
      })
      .catch((_) => {
        this.notifyError(this.get('failed-destroy-message'));
        this.failedDestroy(_);
      })
      .finally(() => !this.get('isDestroyed') && this.set('isDestroyingRecord', false));
  },

  notifySuccess(message) {
    if (message && this.get('notify-of-success')) {
      this.get('formFor').notifySuccess(message);
    }
  },

  notifyError(message) {
    if (message && this.get('notify-of-error')) {
      this.get('formFor').notifyError(message);
    }
  },

  /**
   * Updates a value on the model
   * @method updateValue
   * @param {String} key
   * @param {*} value
   * @public
   */
  updateValue(key, value) {
    // better code reuse this way
    return this.updateValues({[key]: value});
  },

  /**
   * Updates a collection of values on the model
   * @method updateValues
   * @param {Object} keyValues
   * @public
   */
  updateValues(keyValues) {
    this._checkClean();

    const model = this.get('model');
    
    if (model.setProperties) {
      model.setProperties(keyValues);
    } else { 
     setProperties(model, keyValues);
    }

    if (this.get('_hasFailedToSubmit')) {
      Ember.run.next(() => this.runValidations());
    }

    return this.get('auto-submit') ? this.doSubmit() : Promise.resolve(true);
  },

  _checkClean() {
    Ember.run.next(() => {
      const fields = this.get('fields');

      if (fields) {
        if (this.get('fields').every(_ => !_.get('isReallyDirty'))) {
          this._markClean();
        }
        else {
          this._markDirty();
        }
      }
    });
  },

  resetValues(keyValues) {
    const model = this.get('model');
    
    if (model.setProperties) {
      model.setProperties(keyValues);
    } else {
      setProperties(model, keyValues);
    }
    
    this._checkClean();
  },

  resetValue(key, value) {
    this.resetValues({[key]: value});
  },

  /**
   * Marks the form as dirty
   * @method _markDirty
   * @private
   */
  _markDirty() {
    if (!this.get('isDestroyed')) {
      this.set('isModelDirty', true);
    }
  },

  /**
   * Marks the form as clean
   * @method _markClean
   * @private
   */
  _markClean() {
    if (!this.get('isDestroyed')) {
      this.set('isModelDirty', false);
    }
  },

  /**
   * Runs the callback for did submit on all of the fields
   * @method _runFieldDidSubmit
   * @private
   */
  _runFieldDidSubmit() {
    (this.get('fields') || []).forEach(_ => _.formDidSubmit());
  },

  /**
   * Runs the callback for did reset on all of the fields
   * @method _runFieldDidReset
   * @private
   */
  _runFieldDidReset() {
    (this.get('fields') || []).forEach(_ => _.formDidReset());
  },


  /**
   * Registers a field with the form
   * @method registerField
   * @param {FieldFor} field
   * @public
   */
  registerField(field) {
    const fields = this.get('fields') || [];
    fields.push(field);
    this.set('fields', fields);
  },


  /**
   * Unregisters a field with the form
   * @method unregisterField
   * @param {FieldFor} field
   * @public
   */
  unregisterField(field) {
    const fields = this.get('fields') || [];
    fields.removeObject(field);
    this.set('fields', fields);
  },

  init() {
    this._super();

    if (this.get('prevents-navigation')) {
      this.handleWilltransition = (transition) => {
        if (this.get('isModelDirty')) {
          if (confirm('You have unsaved changes, are you sure you want to leave?')) {
          }
          else {
            transition.abort();
          }
        }
      };

      // in test environments that are not acceptance, we won't have real router
      let router = this.get('router');
      if (router && router.on) {
        this.get('router')
          .on('willTransition', this.handleWilltransition);
      }

      // prevent browser reloads
      window.onbeforeunload = () => {
        if (this.get('isModelDirty')) {
          return 'You have unsaved changes, are you sure you want to leave?';
        }
      };
    }
  },

  willDestroyElement() {
    window.onbeforeunload = null;

    // in test environments that are not acceptance, we won't have real router
    let router = this.get('router');
    if (router && router.off) {
      router.off('willTransition', this.handleWilltransition);
    }
  },

  actions: {

    submit() {
      this.doSubmit();
    },

    reset() {
      this.doReset();
    },

    updateValue(key, value) {
      return this.updateValue(key, value);
    },

    updateValues(keyValues) {
      return this.updateValues(keyValues);
    }

  }


});

FormFor.reopenClass({
  positionalParams: ['model']
});

export default FormFor;
