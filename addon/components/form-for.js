import Ember from 'ember';
import layout from '../templates/components/form-for';

const {
  RSVP: {Promise},
  inject: {service},
  computed,
  get,
} = Ember;

const FormFor = Ember.Component.extend({

  layout,

  formFor: service(),

  config: computed(function () {
    return get(Ember.getOwner(this).resolveRegistration('config:environment'), 'APP.ember-form-for');
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
   * A class which will be appended to the form for testing purpose (not styling purposes)
   * @property _testingClass
   * @type String
   * @default '--field-for__<model-name>'
   * @private
   */
  _testingClass: computed('model', function () {
    const model = this.get('model');
    let modelName = 'object';

    if (model) {
      modelName = this.get('model-name') ||
        get(model, 'modelName') ||
        get(model, '_internalModel.modelName') ||
        'object';
    }

    return `--form-for__${modelName}`;
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
   * @property submit-success-message
   * @type String
   * @default null
   * @public
   */
  'submit-success-message': null,

  /**
   * The message to send on submit error
   * @property submit-error-message
   * @type String
   * @default null
   * @public
   */
  'submit-error-message': null,

  /**
   * The message to send on reset success
   * @property reset-success-message
   * @type String
   * @default null
   * @public
   */
  'reset-success-message': null,

  /**
   * The message to send on reset error
   * @property reset-error-message
   * @type String
   * @default null
   * @public
   */
  'reset-error-message': null,

  /**
   * The message to send on destroy success
   * @property destroy-success-message
   * @type String
   * @default null
   * @public
   */
  'destroy-success-message': null,

  /**
   * The message to send on destroy error
   * @property destroy-error-message
   * @type String
   * @default null
   * @public
   */
  'destroy-error-message': null,

  /**
   * Whether or not the form automatically submits on value changes
   * @property auto-submit
   * @type Boolean
   * @default false
   * @public
   */
  'auto-submit': false,

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
   * Called before the form submits, this is where we do
   * validation
   * @method willSubmit
   * @param {Object} model
   * @return {boolean}
   * @public
   */
  willSubmit(model){
    const validationOptions = this.get('validation-options');
    return model.validate ? model.validate(validationOptions) : true;
  },

  /**
   * Called when will submit returned false
   * @method didNotSubmit
   * @param {Object} model
   * @public
   */
  didNotSubmit(/*model*/){
  },

  /**
   * Called when the submit action is called
   * @method onSubmit
   * @param {Object} model
   * @return {Promise.<Object>}
   * @public
   */
  onSubmit(model){
    return model.save ? model.save() : Promise.resolve(model);;
  },

  /**
   * Called when the onSubmit is fulfilled
   * @method didSubmit
   * @param {Object} model
   * @public
   */
  didSubmit(/*model*/){
  },

  /**
   * Called when the onSubmit is rejected
   * @method failedSubmit
   * @param {Object} reason
   * @public
   */
  failedSubmit(/*reason*/){
  },

  /**
   * Action that actual does the submitting
   * @method doSubmit
   * @public
   */
  doSubmit(){

    const model = this.get('model');
    const isSaving = get(model, 'isSaving');

    // Guard if the model is saving
    if (!isSaving && this.willSubmit(model)) {

      this.set('isSubmitting', true);

      return this.onSubmit(model)
        .then(() => {
          this.notifySuccess(this.get('successful-submit-message'));
          this.didSubmit();
        })
        .catch(_ => {
          this.notifyError(this.get('failed-submit-message'));
          this.failedSubmit(_);
        })
        .finally(() => this.set('isSubmitting', false));
    }
    else {
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
  willReset(/*model*/){
    return true;
  },

  /**
   * Called when will reset returned false
   * @method didNotReset
   * @param {Object} model
   * @public
   */
  didNotReset(/*model*/){
  },

  /**
   * Called when the reset action is called
   * @method onReset
   * @param {Object} model
   * @return {Promise.<Object>}
   * @public
   */
  onReset(model){
    return Promise.resolve(model);
  },

  /**
   * Called when the onReset is fulfilled
   * @method didReset
   * @param {Object} model
   * @public
   */
  didReset(/*model*/){
  },

  /**
   * Called when the onReset is rejected
   * @method failedReset
   * @param {Object} reason
   * @public
   */
  failedReset(/*reason*/){
  },

  /**
   * Action that actual does the resetting
   * @method doReset
   * @public
   */
  doReset(){
    const model = this.get('model');

    if (this.willReset(model)) {

      this.set('isResetting', true);

      this.onReset(model)
        .then(() => {
          this.notifySuccess(this.get('successful-reset-message'));
          this.didReset();
        })
        .catch(_ => {
          this.notifyError(this.get('failed-reset-message'));
          this.failedReset(_);
        })
        .finally(() => this.set('isResetting', false));
    }
  },

  /**
   * Called to confirm the destruction of the model
   * @method confirmDestroy
   * @param {Object} model
   * @public
   */
  confirmDestroy(model){

    this.set('isDestroyingRecord', true);
    this.get('formFor')
      .confirmDestroy(model)
      .then(() => this.notifySuccess(this.get('successful-destroy-message')))
      .catch(() => this.notifyError(this.get('failed-destroy-message')))
      .finally(() => this.set('isDestroyingRecord', false));
  },

  notifySuccess(message){
    if (message && this.get('notify-of-success')) {
      this.get('formFor').notifySuccess(message);
    }
  },

  notifyError(message){
    if (message && this.get('notify-of-failure')) {
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
  updateValue(key, value){
    // better code reuse this way
    return this.updateValues({[key]: value});
  },

  /**
   * Updates a collection of values on the model
   * @method updateValues
   * @param {Object} keyValues
   * @public
   */
  updateValues(keyValues){
    this.get('model').setProperties(keyValues);

    return this.get('auto-submit') ? this.doSubmit() : Promise.resolve(true);
  },

  /**
   * Registers a field with the form
   * @method registerField
   * @param {FieldFor} field
   * @public
   */
  registerField(field){
    const fields = this.get('fields') || [];
    fields.push(field);
    this.set('fields', fields);
  },

  actions: {

    submit(){
      this.doSubmit();
    },

    reset(){
      this.doReset();
    },

    updateValue(key, value){
      return this.updateValue(key, value);
    },

    updateValues(keyValues){
      return this.updateValues(keyValues);
    }

  }


});

FormFor.reopenClass({
  positionalParams: ['model']
});

export default FormFor;


