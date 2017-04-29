import Ember from 'ember';
import layout from '../templates/components/field-for';

const {
  computed,
  defineProperty,
  assert,
  get,
  guidFor
} = Ember;

const FieldFor = Ember.Component.extend({

  layout,

  config: computed(function () {
    return get(Ember.getOwner(this).resolveRegistration('config:environment'), 'APP.ember-form-for');
  }),

  // remove tags, so we don't interfere with styles that use direct inheritance
  tagName: '',

  /**
   * The propertyPath that this field gets its value from
   * @property propertyPath
   * @type String
   * @default null
   * @public
   */
  propertyPath: '',

  /**
   * The label for this field
   * @property field
   * @type String
   * @default null
   * @public
   */
  label: null,

  /**
   * The form that this field belongs to
   * @property form
   * @type FormFor
   * @default null
   * @public
   */
  form: null,

  /**
   * Whether or not this field requires confirmation from the user
   * before it commits its value to the form
   * @property  requireConfirm
   * @type boolean
   * @default true
   * @public
   */
  requireConfirm: computed.oneWay('form.requireConfirm'),

  /**
   * Whether or not this field currently requires confirmation
   * @property requireConfirm
   * @type boolean
   * @default true
   * @public
   */
  requiresConfirm: computed.and('requireConfirm', 'isDirty'),

  /**
   * Name of the control that fields, used to define the control
   * that the field wraps
   * @property using
   * @type String
   * @default '-input'
   * @public
   */
  using: '-input',

  /**
   * The fully qualified path to the control for this component
   * @property _control
   * @type String
   * @default 'form-controls/-input-control'
   * @private
   */
  _control: computed('using', 'value', function () {
    return `form-controls/${this.get('using')}-control`;
  }),

  /**
   * Generated ID to tie together the label and the control
   * @property controlId
   * @type String
   * @default 'control-for-<guidForField>'
   * @public
   */
  controlId: computed(function () {
    return `control-for-${guidFor(this)}`;
  }),

  /**
   * Whether or not this field is has been edited but not
   * committed to the form
   * @property isDirty
   * @type String
   * @default false
   * @public
   */
  isDirty: computed('_value', 'value', function () {
    return this.get('_value') !== this.get('value');
  }),

  /**
   * Override this function to perform custom actions on commit
   * @method commitValue
   * @param {String} _propertyPath
   * @param {*} _value
   * @public
   */
  commitValue(/*_propertyPath, _value*/) {
  },

  /**
   * Handles change method from the control, you can override this
   * with a closure action to have custom behaviors
   * @method handleChange
   * @param {*} value
   * @public
   */
  handleChange(value) {
    this.set('_value', value);

    if (!this.get('requireConfirm')) {
      this.commit();
    }
  },

  /**
   * Triggers the commitValue action
   * @method commit
   * @public
   */
  commit(){
    this.commitValue(this.get('propertyPath'), this.get('_value'));
  },

  /**
   * Cancels the current intermediary value, only really useful
   * when not autoCommitting
   * @method cancel
   * @public
   */
  cancel(){
    this.set('_value', this.get('value'));
  },

  init(){
    this._super(...arguments);

    const propertyPath = this.get('propertyPath');

    assert(!!propertyPath, '{{field-for}} Requires a propertyPath to to bind to');

    // bind to errors
    defineProperty(this, 'errors', computed.oneWay(`form.model.errors.${propertyPath}`));

    // bind to the value
    defineProperty(this, 'value', computed.oneWay(`form.model.${propertyPath}`));

    // define _value such that we either use the intermediary value that
    // is set by way of the onChange handler or new values received from the value binding
    defineProperty(this, '_value', computed('value', {
      get() {
        return this.get('value');
      },
      set(key, value) {
        return value;
      }
    }));

    this.get('form').registerField(this);
  }
});

FieldFor.reopenClass({
  positionalParams: ['propertyPath']
});

export default FieldFor;
