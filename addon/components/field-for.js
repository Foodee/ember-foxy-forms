import Ember from 'ember';
import layout from '../templates/components/field-for';

const {
  isArray,
  computed,
  defineProperty,
  assert,
  get,
  guidFor,
  run
} = Ember;

const FieldFor = Ember.Component.extend({

  layout,

  config: computed(function () {
    return get(Ember.getOwner(this).resolveRegistration('config:environment'), 'APP.ember-foxy-forms');
  }),

  // remove tags, so we don't interfere with styles that use direct inheritance
  tagName: '',

  /**
   * The form that this field belongs to
   * @property form
   * @type FormFor
   * @default null
   * @public
   */
  form: null,

  // --------------------------------------------------------------------------------
  // This section is where the DSL syntax lives
  // label
  // require-confirm
  // inline-editing
  // using
  // with-mapping
  //

  /**
   * The label for this field
   * @property field
   * @type String
   * @default null
   * @public
   */
  label: null,

  /**
   * Whether or not this field is disabled
   * @property disabled
   * @type boolean
   * @default false
   * @public
   */
  disabled: computed.oneWay('form.disabled'),

  /**
   * Whether or not this field is readonly
   * @property readonly
   * @type boolean
   * @default false
   * @public
   */
  readonly: computed.oneWay('form.readonly'),

  /**
   * Whether or not this field requires confirmation from the user
   * before it commits its value to the form
   * @property  _requireConfirm
   * @type boolean
   * @default true
   * @public
   */
  'require-confirm': computed.oneWay('form.require-confirm'),
  _requireConfirm: computed.readOnly('require-confirm'),

  /**
   * Whether or not this field is in inline-edit mode, which displays
   * a value that can be clicked on and then reveal the control useful
   * for all sorts of layouts
   * @property inline-editing
   * @type boolean
   * @default false
   * @public
   */
  'inline-editing': computed.oneWay('form.inline-editing'),
  inlineEditing: computed.readOnly('inline-editing'),

  /**
   * Name of the control that fields, used to define the control
   * that the field wraps
   * @property using
   * @type String
   * @default '-input'
   * @public
   */
  using: computed(function () {
    return this.get('_hasCompositeValue') ? '-multiple-input' : '-input';
  }),

  /**
   * The with mapping hash, provides a mapping from model space
   * to control space when using composite values
   * @property _withMapping
   * @type Object
   * @default null
   * @public
   */
  _withMapping: computed.readOnly('with-mapping'),

  /**
   * Wether or not the fields have control callouts (popups / popovers) when in
   * inline-edit mode
   * @property has-control-callout
   * @type Boolean
   * @default false
   * @public
   */
  ['has-control-callout']: computed.oneWay('form.has-control-callout'),

  /**
   * The position of the control callout (up to the client to decide how to use this info)
   * @property control-callout
   * @type String
   * @default 'bottom left'
   * @public
   */
  ['callout-position']: 'bottom left',

  /**
   * Optional array of values to be delegated down to the control, useful
   * for selects or radio groups.
   * @property values
   * @type Array
   * @default null
   * @public
   */
  values: null,

  /**
   * Either delegate the values down to the control, or transform them
   * using the values extractor function
   * @property values
   * @type Array|String
   * @default null
   * @public
   */
  _values: computed('values', function () {
    const values = this.get('values');
    let ret = values;

    if (values && !isArray(values)) {
      // if the values provided is not an array but in fact a string
      // we transform it into a POJO
      return values.split(',').map(this['values-extractor']);
    }

    return ret;
  }),

  /**
   * This method extracts a value for the values array in the
   * event of a string being passed.
   *
   * The expected format is id:value:icon
   * @method values-extractor
   * @param value
   * @returns {{id: String, label: String, icon: String}}
   */
  'values-extractor'(value){
    const chunks = value.split(':');
    const [id, label, icon] = chunks;

    return {id, label, icon};
  },


  /**
   * Function for formatting the value override for custom behavior
   * @method format-value
   * @param {Object} value
   * @returns string
   */
  'format-value'(value) {
    return value;
  },


  /**
   * The result of applying the format-value function to the value
   * @property _formattedValue
   * @type String
   * @default value
   * @private
   */
  'display-value': computed('value', function () {
    return this['format-value'](this.get('value'));
  }),

  /**
   * Tooltip to append to the value when inline editing
   * @property value-tooltip
   * @type String
   * @default null
   * @private
   */
  'value-tooltip': null,

  // --------------------------------------------------------------------------------
  // Computed Properties
  //

  /**
   * A class which will be appended to the field for testing purpose (not styling purposes)
   * @property _testingClass
   * @type String
   * @default '--field-for__<params>'
   * @private
   */
  _testingClass: computed(function () {
    return `--field-for__${this.get('params').join('__')}`;
  }),

  /**
   * Whether or not this field currently requires confirmation
   * @property __requiresConfirm
   * @type boolean
   * @default true
   * @private
   */
  _requiresConfirm: computed('_requireConfirm', 'inlineEditing', 'isDirty', function () {
    return this.get('_requireConfirm') && this.get('isDirty') || this.get('inlineEditing');
  }),

  /**
   * The fully qualified path to the control for this component
   * @property _control
   * @type String
   * @default 'form-controls/-input-control'
   * @private
   */
  _control: computed('using', function () {
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
    return JSON.stringify(this.get('_value')) !== JSON.stringify(this.get('value'));
  }),


  /**
   * Whether or not the current field mapping has any errors
   * @property hasErrorsj
   * @type boolean
   * @public
   */
  hasErrors: computed.notEmpty('errors'),

  /**
   * Whether or not we show the control component
   * @property _showControl
   * @type boolean
   * @private
   */
  _showControl: computed('inlineEditing', 'isEditing', 'hasError', function () {
    return !this.get('inlineEditing') || this.get('inlineEditing') && this.get('isEditing') || this.get('hasError');
  }),

  /**
   * Whether or not we show the value / placeholder component
   * @property _showValue
   * @type boolean
   * @private
   */
  _showValue: computed('inlineEditing', 'isEditing', 'hasError', function () {
    return this.get('inlineEditing') && (!this.get('isEditing') || this.get('has-control-callout'));
  }),

  /**
   * Whether or not we show the confirm buttons
   * @property _showConfirm
   * @type boolean
   * @private
   */
  _showConfirm: computed(
    '_requiresConfirm', function () {
      return this.get('_requiresConfirm');
    }),

  /**
   * Whether or not this field is a composite value, meaning
   * that it exposes more than one value to the control layer
   * by way of a pojo mapping keys to values
   * @property _hasCompositeValue
   * @type boolean
   * @default false
   * @private
   */
  _hasCompositeValue: computed.gt('params.length', 1),

  /**
   * Override this function to perform custom actions on commit
   * @method commitValue
   * @param {String} propertyPath
   * @param {*} value
   * @public
   */
  commitValue(/*propertyPath, value*/) {
  },

  commitValues(/*value*/) {
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

    if (!this.get('_requiresConfirm')) {
      this.commit();
    }
  },

  /**
   * Triggers the commitValue action
   * @method commit
   * @public
   */
  commit(){
    const params = this.get('params');

    let commitPromise = null;

    if (this.get('_hasCompositeValue')) {
      const _value = this.get('_value');
      const _withMapping = this.get('withMapping') || {};

      const keyValue = params.reduce((acc, param) => {
        const key = _withMapping[param] || param;
        acc[param] = _value[key];

        return acc;
      }, {});

      commitPromise = this.commitValues(keyValue);
    }
    else {
      commitPromise = this.commitValue(params[0], this.get('_value'));
    }

    commitPromise.finally(() => {
      if (!this.get('hasErrors')) {
        this.set('isEditing', false);
      }
    });

  },

  /**
   * Cancels the current intermediary value, only really useful
   * when not autoCommitting
   * @method cancel
   * @public
   */
  cancel(){
    this.set('_value', this.get('value'));

    if (!this.get('hasErrors')) {
      this.set('isEditing', false);
    }
  },

  actions: {
    edit(){
      this.set('isEditing', true);
      run.next(() => {

        if (this.get('_showControl')) {
          Ember.$(`#${this.get('controlId')}`).focus();
        }
      });
    }
  },

  init(){
    this._super(...arguments);

    const params = this.get('params');

    if (this.get('_hasCompositeValue')) {
      // property paths to watch
      const propertyPaths = params.join(',');
      const _withMapping = this.get('withMapping') || {};

      // bind to the value
      defineProperty(this, 'value', computed(`form.model.{${propertyPaths}}`, function () {

        return params.reduce((acc, param) => {
          // we either use the key map provided by the user, or the
          // default key value
          const key = _withMapping[param] || param;
          acc[key] = this.get(`form.model.${param}`);

          return acc;
        }, {});

      }));

      const errorPaths = params.map(_ => `form.model.errors.${_}`);
      defineProperty(this, 'errors', computed.union(...errorPaths));
    }
    else {
      const propertyPath = params[0];

      assert(!!propertyPath, '{{field-for}} Requires a propertyPath to bind to');

      // bind to the value
      defineProperty(this, 'value', computed.oneWay(`form.model.${propertyPath}`));

      // bind to errors
      defineProperty(this, 'errors', computed.oneWay(`form.model.errors.${propertyPath}`));
    }

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

    // Capture backup value that will allow full roll back if there are errors on cancel
    // update the backup value after successful commit

    this.get('form').registerField(this);
  }
});

FieldFor.reopenClass({
  // Setting the positional params to 'params' makes all positional params available to
  // the component at runtime under the key 'params' we use this to allow the component
  // to take a variable number of params thus supporting single value or composite value mode
  positionalParams: 'params'
});

export default FieldFor;
