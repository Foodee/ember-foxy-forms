import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { arg } from 'ember-arg-types';
import { bool } from 'prop-types';
import { oneWay, readOnly, notEmpty, gt, union } from '@ember/object/computed';
import { dasherize } from '@ember/string';
import { isArray } from '@ember/array';
import { action, defineProperty, computed } from '@ember/object';
import { assert } from '@ember/debug';
import { guidFor } from '@ember/object/internals';
import { run } from '@ember/runloop';

export default class FieldForComponent extends Component {
  constructor() {
    super(...arguments);

    if (this._hasCompositeValue) {
      // property paths to watch
      const propertyPaths = this.args.params.join(',');
      const _withMapping = this.withMapping || {};

      // bind to the value
      defineProperty(
        this,
        'value',
        computed(
          // eslint-disable-next-line ember/use-brace-expansion
          `args.form.{model,model.${propertyPaths}}`,
          'args.form.model',
          'args.params',
          function () {
            return this.args.params.reduce((acc, param) => {
              // we either use the key map provided by the user, or the
              // default key value
              const key = _withMapping[param] || param;
              acc[key] = this.args.form.model[param];

              return acc;
            }, {});
          }
        )
      );

      const errorPaths = this.args.params.map((param) => `args.form.model.errors.${param}`);
      defineProperty(this, 'errors', union(...errorPaths));
    } else {
      const propertyPath = this.args.params[0];

      assert('<FieldFor /> Requires a propertyPath to bind to', !!propertyPath);

      // bind to the value
      defineProperty(this, 'value', oneWay(`args.form.model.${propertyPath}`));

      // bind to errors
      defineProperty(this, 'errors', oneWay(`args.form.model.errors.${propertyPath}`));

      this._lastValidValue = isArray(this.value) ? this.value.toArray() : this.value;
    }

    // Capture backup value that will allow full roll back if there are errors on cancel
    // update the backup value after successful commit
    // debugger;
    this.args.form.registerField(this);
  }

  // define _value such that we either use the intermediary value that
  // is set by way of the onChange handler or new values received from the value binding
  get _value() {
    return this.value;
  }

  set _value(value) {
    this.value = value;
  }

  /**
   * The form that this field belongs to
   * @property form
   * @type FormFor
   * @default null
   * @public
   */
  form = null;

  // --------------------------------------------------------------------------------
  // This section is where the DSL syntax lives
  // label
  // requireConfirm
  // using
  // withMapping
  //

  /**
   * The label for this field
   * @property field
   * @type String
   * @default null
   * @public
   */
  label = null;

  /**
   * Whether or not this field is disabled
   * @property disabled
   * @type boolean
   * @default false
   * @public
   */
  @oneWay('form.disabled') disabled;

  /**
   * Whether or not this field is readonly
   * @property readonly
   * @type boolean
   * @default false
   * @public
   */
  @oneWay('form.readonly') readonly;

  /**
   * Whether or not this field requires confirmation from the user
   * before it commits its value to the form
   * @property  _requireConfirm
   * @type boolean
   * @default true
   * @public
   */
  @oneWay('form.requireConfirm') requireConfirm;
  @readOnly('requireConfirm') _requireConfirm;

  /**
   * Name of the control that fields, used to define the control
   * that the field wraps
   * @property _using
   * @type String
   * @default '-input'
   * @public
   */
  get _using() {
    if (!this.args.using) {
      return this._hasCompositeValue ? '-multiple-input' : '-input';
    }

    return this.args.using;
  }

  /**
   * The with mapping hash, provides a mapping from model space
   * to control space when using composite values
   * @property _withMapping
   * @type Object
   * @default null
   * @public
   */
  @readOnly('withMapping') _withMapping;

  /**
   * Wether or not the fields have control callouts (popups / popovers) when in
   * inline-edit mode
   * @property hasControlCallout
   * @type Boolean
   * @default false
   * @public
   */
  @arg(bool)
  hasControlCallout = false;

  /**
   * The position of the control callout (up to the client to decide how to use this info)
   * @property calloutPosition
   * @type String
   * @default null
   * @public
   */
  calloutPosition = null;

  /**
   * The position of the control callout (up to the client to decide how to use this info)
   * This will default to the site-wide environment value if no override is given for this field
   * @property _calloutPosition
   * @type String
   * @private
   */
  get _calloutPosition() {
    return this.calloutPosition || (this.config && this.config.fieldForControlCalloutPosition);
  }

  /**
   * Either delegate the values down to the control, or transform them
   * using the values extractor function
   * @property values
   * @type Array|String
   * @default null
   * @public
   */
  get _values() {
    const ret = this.args.values;

    if (this.args.values && !isArray(this.args.values)) {
      // if the values provided is not an array but in fact a string
      // we transform it into a POJO

      return this.args.values.split(',').map((value) => this.valuesExtractor(value));
    }

    return ret;
  }

  /**
   * This method extracts a value for the values array in the
   * event of a string being passed.
   *
   * The expected format is id:value:icon
   * @method values-extractor
   * @param value
   * @returns {{id: String, label: String, icon: String}}
   */
  valuesExtractor(value) {
    const chunks = value.split(':');
    const [id, label, icon] = chunks;

    return { id, label, icon };
  }

  /**
   * Function for formatting the value override for custom behavior
   * @method formatValue
   * @param {Object} value
   * @returns string
   */
  formatValue(value) {
    return value;
  }

  /**
   * The result of applying the formatValue function to the value
   * @property _formattedValue
   * @type String
   * @default value
   * @private
   */
  get displayValue() {
    return this.formatValue(this.value);
  }

  /**
   * Tooltip to append to the value when inline editing
   * @property valueTooltip
   * @type String
   * @default null
   * @private
   */
  valueTooltip = null;

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
  get _testingClass() {
    return `${this.args.testingClassPrefix}field-for__${
      this.args.form._modelName
    }_${this.args.params
      .map((_) => _.toString())
      .map(dasherize)
      .join('_')
      .replace(/\./g, '__')}`;
  }

  /**
   * Whether or not this field currently requires confirmation
   * @property __requiresConfirm
   * @type boolean
   * @default true
   * @private
   */
  get _requiresConfirm() {
    return (this._requireConfirm && this.isDirty) || this.args.inlineEditing;
  }

  /**
   * The fully qualified path to the control for this component
   * @property _control
   * @type String
   * @default 'form-controls/-input-control'
   * @private
   */
  get _control() {
    return `form-controls/${this._using}-control`;
  }

  /**
   * Generated ID to tie together the label and the control
   * @property controlId
   * @type String
   * @default 'control-for-<guidForField>'
   * @public
   */
  get controlId() {
    return `control-for-${guidFor(this)}`;
  }

  /**
   * Whether or not this field is has been edited but not
   * committed to the form
   * @property isDirty
   * @type String
   * @default false
   * @public
   */
  get isDirty() {
    return this._stringify(this._value) !== this._stringify(this.value);
  }

  /**
   * Whether or not this field is has been edited and
   * committed to the form, but the form has not submited that value
   * @property isDirty
   * @type String
   * @default false
   * @public
   */
  get isReallyDirty() {
    // initial values on string values may be null which looks the same as an empty value.
    return (
      this._stringify(this._lastValidValue) !== this._stringify(this.value) &&
      !(
        (this._lastValidValue === null && this.value === '') ||
        (this._lastValidValue === '' && this.value === null) ||
        (this._lastValidValue === undefined && this.value === '') ||
        (this._lastValidValue === '' && this.value === undefined)
      )
    );
  }

  /**
   * Stringifies a value, we can't just use JSON.stringify directly as it can create circular refs
   * array objects, in those cases we will map recursively.
   *
   * @method
   * @param {*} value
   * @returns {string}
   * @private
   */
  _stringify(value) {
    return isArray(value) ? value.map((_) => this._stringify(_)).join(',') : JSON.stringify(value);
  }

  /**
   * Whether or not the current field mapping has any errors
   * @property hasErrorsj
   * @type boolean
   * @public
   */
  @notEmpty('errors') hasErrors;

  /**
   * Whether or not we show the control component
   * @property _showControl
   * @type boolean
   * @private
   */
  get _showControl() {
    return !this.args.inlineEditing || (this.args.inlineEditing && this.isEditing);
  }

  @tracked isEditing = false;

  /**
   * Whether or not we show the value / placeholder component
   * @property _showValue
   * @type boolean
   * @private
   */
  get _showValue() {
    return (
      (this.args.inlineEditing && !this.isEditing) || this.args.hasControlCallout || this.hasErrors
    );
  }

  /**
   * Whether or not we show the confirm buttons
   * @property _showConfirm
   * @type boolean
   * @private
   */
  get _showConfirm() {
    return this._requiresConfirm;
  }

  /**
   * Whether or not this field is a composite value, meaning
   * that it exposes more than one value to the control layer
   * by way of a pojo mapping keys to values
   * @property _hasCompositeValue
   * @type boolean
   * @default false
   * @private
   */
  @gt('args.params.length', 1) _hasCompositeValue;

  /**
   * Handles change method from the control, you can override this
   * with a closure action to have custom behaviors
   * @method handleChange
   * @param {*} value
   * @public
   */
  @action
  handleChange(value) {
    this._value = value;

    if (!this._requiresConfirm) {
      this.commit();
    }
  }

  _extractKeyValueMapping(_value) {
    const params = this.args.params;
    const _withMapping = this.withMapping || {};

    const keyValues = params.reduce((acc, param) => {
      const key = _withMapping[param] || param;
      acc[param] = _value[key];

      return acc;
    }, {});

    return keyValues;
  }

  /**
   * Triggers the commitValue action
   * @method commit
   * @public
   */
  @action
  commit() {
    let commitPromise = null;

    if (this._hasCompositeValue) {
      const keyValue = this._extractKeyValueMapping(this._value);
      const prevKeyValue = this.value && this._extractKeyValueMapping(this.value);
      commitPromise = this.args
        .commitValues(keyValue)
        .then(() => this.didCommitValues(keyValue, prevKeyValue));
    } else {
      commitPromise = this.args
        .commitValue(this.args.params[0], this._value)
        .then(() => this.didCommitValue(this._value, this.value));
    }

    commitPromise.finally(() => {
      if (!this.hasErrors) {
        this.isEditing = false;
      }
    });
  }

  /**
   * Triggered after the commit method is called
   * @method commit
   * @param {*} value
   * @public
   */
  didCommitValue(/* value */) {}

  /**
   * Triggered after the commit method is called for multiple values
   * @method commit
   * @param {Object} values
   * @public
   */
  didCommitValues(/* values */) {}

  /**
   * Cancels the current intermediary value, only really useful
   * when not autoCommitting
   * @method cancel
   * @public
   */
  @action
  cancel() {
    this._value = this.value;
    this._resetField();
    this.isEditing = false;
  }

  /**
   * Callback for when the form submits
   * @method formDidSubmit
   * @public
   */
  formDidSubmit() {
    this._lastValidValue = isArray(this.value) ? this.value.toArray() : this.value;
  }

  /**
   * Callback for when the form resets
   * @method formDidReset
   * @public
   */
  formDidReset() {
    this._resetField();
  }

  /**
   * Resets the field to the backup value by re-committing the value
   * @method _resetField
   * @private
   */
  _resetField() {
    const form = this.args.form;

    if (this._hasCompositeValue) {
      form.resetValues(this._extractKeyValueMapping(this._lastValidValue));
    } else {
      form.resetValue(this.args.params[0], this._lastValidValue);
    }

    form.clearValidations();
  }

  @action
  edit() {
    this.isEditing = true;
    run.next(() => {
      if (this._showControl) {
        document.querySelector(`#${this.controlId}`).focus();
      }
    });
  }

  @action
  doSubmit() {
    if (this._requiresConfirm) {
      this.commit();
    } else {
      return this.args.form.doSubmit();
    }
  }

  @action
  doReset() {
    return this.args.form.doReset();
  }

  willDestroy() {
    this.args.form.unregisterField(this);
  }
}
