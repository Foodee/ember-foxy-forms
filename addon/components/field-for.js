import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { arg } from 'ember-arg-types';
import { array, func, bool, string, object } from 'prop-types';
import { oneWay, notEmpty, gt, union, readOnly } from '@ember/object/computed';
import { dasherize } from '@ember/string';
import { isArray } from '@ember/array';
import { action, defineProperty, computed } from '@ember/object';
import { assert } from '@ember/debug';
import { guidFor } from '@ember/object/internals';
import { later } from '@ember/runloop';
import { isBlank } from '@ember/utils';
import { inject as service } from '@ember/service';

export default class FieldForComponent extends Component {
  @service formFor;

  constructor() {
    super(...arguments);

    if (this._hasCompositeValue) {
      // property paths to watch
      const propertyPaths = this.propertyPath;
      const _withMapping = this.args.withMapping || {};

      // bind to the value
      defineProperty(
        this,
        'value',
        computed(
          // eslint-disable-next-line ember/use-brace-expansion
          `args.form.{model,model.${propertyPaths}}`,
          'args.form.model',
          'args.{for,params}',
          'params',
          function () {
            return this.params.reduce((acc, param) => {
              // we either use the key map provided by the user, or the
              // default key value
              const key = _withMapping[param] || param;
              acc[key] = this.args.form.model[param];

              return acc;
            }, {});
          }
        )
      );

      const errorPaths = this.params.map((param) => `args.form.model.errors.${param}`);
      defineProperty(this, 'errors', union(...errorPaths));
    } else {
      const propertyPath = this.propertyPath;

      assert('<FieldFor /> Requires a propertyPath to bind to', !!propertyPath);

      // bind to the value
      defineProperty(this, 'value', oneWay(`args.form.model.${propertyPath}`));

      // bind to errors
      defineProperty(this, 'errors', oneWay(`args.form.model.errors.${propertyPath}`));
    }

    // Capture backup value that will allow full roll back if there are errors on cancel
    // update the backup value after successful commit
    this._lastValidValue = isArray(this.value) ? this.value.toArray() : this.value;

    this.args.form.registerField(this);

    // define _value such that we either use the intermediary value that
    // is set by way of the onChange handler or new values received from the value binding
    defineProperty(
      this,
      '_value',
      computed('value', {
        get() {
          return this.value;
        },
        set(key, value) {
          return value;
        },
      })
    );
  }

  @tracked isEditing = false;

  // --------------------------------------------------------------------------------
  // Computed Properties
  //

  @readOnly('formFor.buttonClasses') buttonClasses;

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
   * Whether or not the current field mapping has any errors
   * @property hasErrorsj
   * @type boolean
   * @public
   */
  @notEmpty('errors') hasErrors;

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
   * A class which will be appended to the field for testing purpose (not styling purposes)
   * @property _testingClass
   * @type String
   * @default '--field-for__<params>'
   * @private
   */
  get _testingClass() {
    return `${this.args.testingClassPrefix}field-for__${this._testingSelector}`;
  }

  get _testingSelector() {
    return `${this.args.form._modelName}_${this.params
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
    return (this.requireConfirm && this.isDirty) || this.inlineEditing;
  }

  /**
   * Guid for this field
   * @property guid
   * @type String
   * @default '<guidForField>'
   * @public
   */
  get guid() {
    return guidFor(this);
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
    return !(this.isDestroyed && this.isDestroying) && this._valueIsDirty && this._valueIsNotBlank;
  }

  get _valueIsDirty() {
    return this._stringify(this._lastValidValue) !== this._stringify(this.value);
  }
  get _valueIsNotBlank() {
    return !isBlank(this._lastValidValue) || !isBlank(this.value);
  }

  /**
   * Whether or not we show the control component
   * @property _showControl
   * @type boolean
   * @private
   */
  get _showControl() {
    return (
      !this.inlineEditing ||
      (this.inlineEditing && this.isEditing) ||
      (this.hasControlCallout && this.hasErrors)
    );
  }

  /**
   * Whether or not we show the value / placeholder component
   * @property _showValue
   * @type boolean
   * @private
   */
  get _showValue() {
    return (this.inlineEditing && !this.isEditing) || this.hasControlCallout;
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

  get propertyPath() {
    return this.params.join(',');
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

    // if we only have an ID we just pass the ID
    return chunks.length === 1 ? id : { id, label, icon };
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

  _extractKeyValueMapping(_value) {
    const params = this.params;
    const _withMapping = this.args.withMapping || {};

    const keyValues = params.reduce((acc, param) => {
      const key = _withMapping[param] || param;
      acc[param] = _value[key];

      return acc;
    }, {});

    return keyValues;
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
      form.resetValue(this.params[0], this._lastValidValue);
    }

    form.clearValidations();
  }

  willDestroy() {
    this.args.form.deregisterField(this);
  }

  // --------------------------------------------------------------------------------
  // This section is where the DSL syntax lives

  /**
   * The form that this field belongs to
   * @property form
   * @type FormFor
   * @default null
   * @public
   */
  @arg()
  form = null;

  /**
   * The tag name that we use for this field
   * @property tagName
   * @type String
   * @default form
   * @public
   */
  @arg(string)
  tagName = 'div';

  /**
   * The label for this field
   * @property field
   * @type String
   * @default null
   * @public
   */
  @arg(string)
  label = null;

  /**
   * Generated ID to tie together the label and the control
   * @property controlId
   * @type String
   * @default 'control-for-<guidForField>'
   * @public
   */
  @arg(string)
  get controlId() {
    return `control-for-${this.guid}`;
  }

  /**
   * The with mapping hash, provides a mapping from model space
   * to control space when using composite values
   * @property _withMapping
   * @type Object
   * @default null
   * @public
   */
  @arg(object)
  withMapping = {};

  /**
   * Whether or not this form is setup for inline editing
   * @property inlineEditing
   * @type boolean
   * @default false
   * @public
   */
  @arg(bool)
  inlineEditing = false;

  /**
   * Whether or not this field requires confirmation to apply values to
   * the model
   * @property requireConfirm
   * @type boolean
   * @default false
   * @public
   */
  @arg(bool)
  requireConfirm = false;

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
   * Tooltip to append to the value when inline editing
   * @property valueTooltip
   * @type String
   * @default null
   * @private
   */
  @arg(string)
  valueTooltip = null;

  /**
   * The position of the control callout (up to the client to decide how to use this info)
   * @property calloutPosition
   * @type String
   * @default null
   * @public
   */
  @arg(string)
  get calloutPosition() {
    return this.formFor?.fieldForControlCalloutPosition || null;
  }

  /**
   * The fully qualified path to the control for this component
   * @property control
   * @type String
   * @default 'form-controls/ff-input'
   * @private
   */
  @arg(string)
  get control() {
    const controlsFolder = this.formFor.controlsFolder;
    const controlPrefix = this.formFor.controlPrefix;

    let controlName = `${controlPrefix}${this.args.using}`;

    if (!this.args.using) {
      controlName = this._hasCompositeValue
        ? `${controlPrefix}multiple-input`
        : `${controlPrefix}input`;
    }

    return `${controlsFolder}/${controlName}`;
  }

  @arg(array)
  get params() {
    return this.args.params ?? isArray(this.args.for) ? this.args.for : [this.args.for];
  }

  /**
   * Fully qualified path to a custom display component for rendering this value
   * @method  displayValueComponent
   * @default null
   * @param {String} value
   * @returns string
   */
  @arg(string)
  displayValueComponent = null;

  /**
   * Function for formatting the value override for custom behavior
   * @method formatValue
   * @param {Object} value
   * @returns string
   */
  @arg(func)
  formatValue = (value) => {
    return this._hasCompositeValue ? JSON.stringify(value) : value;
  };

  /**
   * Triggered after the commit method is called
   * @method commit
   * @param {*} value
   * @public
   */
  @arg(func)
  didCommitValue = (/* value */) => {};

  /**
   * Triggered after the commit method is called for multiple values
   * @method commit
   * @param {Object} values
   * @public
   */
  @arg(func)
  didCommitValues = (/* values */) => {};

  /**
   * Callback for when the form submits
   * @method formDidSubmit
   * @public
   */
  @arg(func)
  formDidSubmit = () => {
    this._lastValidValue = isArray(this.value) ? this.value.toArray() : this.value;
  };

  /**
   * Callback for when the form resets
   * @method formDidReset
   * @public
   */
  @arg(func)
  formDidReset = () => {
    this._resetField();
  };

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
        .commitValue(this.params[0], this._value)
        .then(() => this.didCommitValue(this._value, this.value));
    }

    commitPromise.finally(() => {
      if (!this.hasErrors) {
        this.isEditing = false;
      }
    });
  }

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

  @action
  edit() {
    this.isEditing = true;
    later(() => {
      if (this._showControl) {
        document.querySelector(`#${this.controlId}`).focus();
      }
    }, 100);
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
}
