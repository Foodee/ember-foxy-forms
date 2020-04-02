import Component from '@ember/component';
import { oneWay, readOnly, notEmpty, gt, union } from '@ember/object/computed';
import { dasherize } from '@ember/string';
import { isArray } from '@ember/array';
import { action, defineProperty, computed, set } from '@ember/object';
import { assert } from '@ember/debug';
import { guidFor } from '@ember/object/internals';
import { run } from '@ember/runloop';
import { tagName } from '@ember-decorators/component';

@tagName('') // remove tags, so we don't interfere with styles that use direct inheritance
export default class FieldForComponent extends Component {
  init() {
    super.init(...arguments);

    if (this._hasCompositeValue) {
      // property paths to watch
      const propertyPaths = this.params.join(',');
      const _withMapping = this.withMapping || {};

      // bind to the value
      defineProperty(
        this,
        'value',
        computed(`form.model.{${propertyPaths}}`, 'form.model', 'params', function () {
          return this.params.reduce((acc, param) => {
            // we either use the key map provided by the user, or the
            // default key value
            const key = _withMapping[param] || param;
            acc[key] = this.form.model[param];

            return acc;
          }, {});
        })
      );

      const errorPaths = this.params.map((_) => `form.model.errors.${_}`);
      defineProperty(this, 'errors', union(...errorPaths));
    } else {
      const propertyPath = this.params[0];

      assert('<FieldFor /> Requires a propertyPath to bind to', !!propertyPath);

      // bind to the value
      defineProperty(this, 'value', oneWay(`form.model.${propertyPath}`));

      // bind to errors
      defineProperty(this, 'errors', oneWay(`form.model.errors.${propertyPath}`));
    }

    // Capture backup value that will allow full roll back if there are errors on cancel
    // update the backup value after successful commit

    this.form.registerField(this);
  }

  // define _value such that we either use the intermediary value that
  // is set by way of the onChange handler or new values received from the value binding
  get _value() {
    return this.value;
  }

  set _value(value) {
    this.value = value;
    return value;
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
  // inlineEditing
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
   * Whether or not this field is in inline-edit mode, which displays
   * a value that can be clicked on and then reveal the control useful
   * for all sorts of layouts
   * @property inlineEditing
   * @type boolean
   * @default false
   * @public
   */
  // @oneWay('form.inlineEditing') inlineEditing;
  // @readOnly('form.inlineEditing') _inlineEditing;
  @readOnly('inlineEditing') _inlineEditing;

  /**
   * Name of the control that fields, used to define the control
   * that the field wraps
   * @property _using
   * @type String
   * @default '-input'
   * @public
   */
  @computed('using')
  get _using() {
    if (!this.using) {
      return this._hasCompositeValue ? '-multiple-input' : '-input';
    }

    return this.using;
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
  @oneWay('form.hasControlCallout') hasControlCallout;

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
  @computed('calloutPosition', 'config')
  get _calloutPosition() {
    return this.calloutPosition || (this.config && this.config.fieldForControlCalloutPosition);
  }

  /**
   * Optional array of values to be delegated down to the control, useful
   * for selects or radio groups.
   * @property values
   * @type Array
   * @default null
   * @public
   */
  values = null;

  /**
   * Either delegate the values down to the control, or transform them
   * using the values extractor function
   * @property values
   * @type Array|String
   * @default null
   * @public
   */
  @computed('values')
  get _values() {
    const ret = this.values;

    if (this.values && !isArray(this.values)) {
      // if the values provided is not an array but in fact a string
      // we transform it into a POJO
      return this.values.split(',').map((value) => this.valuesExtractor(value));
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
    return `${this.testingClassPrefix}field-for__${this.form._modelName}_${this.params
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
  @computed('_requireConfirm', '_inlineEditing', 'isDirty')
  get _requiresConfirm() {
    return (this._requireConfirm && this.isDirty) || this._inlineEditing;
  }

  /**
   * The fully qualified path to the control for this component
   * @property _control
   * @type String
   * @default 'form-controls/-input-control'
   * @private
   */
  @computed('_using')
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
  @computed('_value', 'value')
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
  @computed('_lastValidValue', 'value')
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
  @computed('_inlineEditing', 'isEditing')
  get _showControl() {
    return !this._inlineEditing || (this._inlineEditing && this.isEditing);
  }

  isEditing = false;

  /**
   * Whether or not we show the value / placeholder component
   * @property _showValue
   * @type boolean
   * @private
   */
  @computed('_inlineEditing', 'isEditing', 'hasErrors', 'hasControlCallout')
  get _showValue() {
    return (this._inlineEditing && !this.isEditing) || this.hasControlCallout || this.hasErrors;
  }

  /**
   * Whether or not we show the confirm buttons
   * @property _showConfirm
   * @type boolean
   * @private
   */
  @computed('_requiresConfirm')
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
  @gt('params.length', 1) _hasCompositeValue;

  /**
   * Override this function to perform custom actions on commit
   * @method commitValue
   * @param {String} propertyPath
   * @param {*} value
   * @public
   */
  commitValue(/*propertyPath, value*/) { }

  commitValues(/*value*/) { }

  /**
   * Handles change method from the control, you can override this
   * with a closure action to have custom behaviors
   * @method handleChange
   * @param {*} value
   * @public
   */
  @action
  handleChange(value) {
    set(this, '_value', value);

    if (!this._requiresConfirm) {
      this.commit();
    }
  }

  _extractKeyValueMapping(_value) {
    const params = this.params;
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
      commitPromise = this.commitValues(keyValue).then(() =>
        this.didCommitValues(keyValue, prevKeyValue)
      );
    } else {
      commitPromise = this.commitValue(this.params[0], this._value).then(() =>
        this.didCommitValue(this._value, this.value)
      );
    }

    commitPromise.finally(() => {
      if (!this.hasErrors) {
        set(this, 'isEditing', false);
      }
    });
  }

  /**
   * Triggered after the commit method is called
   * @method commit
   * @param {*} value
   * @public
   */
  didCommitValue(/* value */) { }

  /**
   * Triggered after the commit method is called for multiple values
   * @method commit
   * @param {Object} values
   * @public
   */
  didCommitValues(/* values */) { }

  /**
   * Cancels the current intermediary value, only really useful
   * when not autoCommitting
   * @method cancel
   * @public
   */
  @action
  cancel() {
    set(this, '_value', this.value);
    this._resetField();
    set(this, 'isEditing', false);
  }

  /**
   * Callback for when the form submits
   * @method formDidSubmit
   * @public
   */
  formDidSubmit() {
    const value = this.value;
    set(this, '_lastValidValue', isArray(value) ? value.toArray() : value);
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
    const form = this.form;

    if (this._hasCompositeValue) {
      form.resetValues(this._extractKeyValueMapping(this._lastValidValue));
    } else {
      form.resetValue(this.params[0], this._lastValidValue);
    }

    form.clearValidations();
  }

  @action
  edit() {
    set(this, 'isEditing', true);
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
      return this.form.doSubmit();
    }
  }

  @action
  doReset() {
    return this.form.doReset();
  }

  didInsertElement() {
    const value = this.value;
    set(this, '_lastValidValue', isArray(value) ? value.toArray() : value);
  }

  willDestroyElement() {
    this.form.unregisterField(this);
  }
}
