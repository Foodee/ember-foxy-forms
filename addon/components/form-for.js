import Ember from 'ember';
import layout from '../templates/components/form-for';

const {
  RSVP: {Promise},
  computed,
  get
} = Ember;

const FormFor = Ember.Component.extend({

  layout,

  config: computed(function () {
    return get(Ember.getOwner(this).resolveRegistration('config:environment'), 'APP.ember-form-for');
  }),

  // remove tags, so we don't interfere with styles that use direct inheritance
  tagName: '',

  /**
   * Collection of all child field registered with this form
   * @property fields
   * @type FieldFor[]
   * @default []
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

  /**
   * Whether or not this form requires confirmation to apply values to
   * the model
   * @property requireConfirm
   * @type boolean
   * @default true
   * @public
   */
  requireConfirm: false,

  /**
   * Called before the form submits, this is where we do
   * validation
   * @method willSubmit
   * @param {Object} model
   * @returns boolean
   * @public
   */
  willSubmit(/*model*/){
    return true;
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
   * @returns {Promise.<Object>}
   * @public
   */
  onSubmit(model){
    return Promise.resolve(model);
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
   * @method submit
   * @public
   */
  doSubmit(){
    const model = this.get('model');

    this.set('isSubmitting', true);


    if (this.willSubmit(model)) {
      this.onSubmit(model)
        .then(_ => this.didSubmit(_))
        .catch(reason => this.failedSubmit(reason))
        .finally(() => this.set('isSubmitting', false));
    }
  },

  /**
   * Called before the form resets
   * @method willReset
   * @param {Object} model
   * @returns boolean
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
   * @returns {Promise.<Object>}
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
   * @method submit
   * @public
   */
  doReset(){
    const model = this.get('model');

    this.set('isResetting', true);


    if (this.willReset(model)) {

      this.onReset(model)
        .then(() => this.didReset())
        .catch(_ => this.failedReset(_))
        .finally(() => this.set('isResetting', true));
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
    this.set(`form.model.${key}`, value);
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
    }

  }


});

FormFor.reopenClass({
  positionalParams: ['model']
});

export default FormFor;


