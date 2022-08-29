import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { arg } from 'ember-arg-types';
import { array, func, bool, string, object, any } from 'prop-types';
import { oneWay, notEmpty, gt, union, readOnly } from '@ember/object/computed';
import { dasherize } from '@ember/string';
import { isArray } from '@ember/array';
import { action, defineProperty, computed, get } from '@ember/object';
import { assert, deprecate } from '@ember/debug';
import { guidFor } from '@ember/object/internals';
import { later } from '@ember/runloop';
import { isBlank } from '@ember/utils';
import { inject as service } from '@ember/service';
import { getOwner } from '@ember/application';
import { isPlainObject } from 'is-plain-object';

export default class FieldForComponent extends Component {
  @service formFor;

  constructor() {
    super(...arguments);

    if (this._hasCompositeValue) {
      // property paths to watch
      const propertyPaths = this.propertyPath;
      const _withMapping = this.args.withMapping || {};
      const modelPropertyPaths = propertyPaths
        .split(',')
        .map((_) => `model.${_}`)
        .join(',');

      // bind to the value
      defineProperty(
        this,
        'value',
        computed(
          // eslint-disable-next-line ember/use-brace-expansion
          `args.form.{model,${modelPropertyPaths}}`,
          'args.form.model',
          'args.{for,params}',
          'params',
          function () {
            return this.params.reduce((acc, param) => {
              // we either use the key map provided by the user, or the
              // default key value
              const param_chunks = param.split('.');
              const key = _withMapping[param] || param_chunks[param_chunks.length - 1];
              acc[key] = get(this.args.form.model, param);

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

  @tracked controlShouldStoreAsPrimitive = false;

  @tracked hideDefaultLabel = false;

  // --------------------------------------------------------------------------------
  // Computed Properties
  //

  @readOnly('formFor.buttonClasses') buttonClasses;
  @readOnly('formFor.fieldClasses') fieldClasses;
  @readOnly('formFor.testingClassPrefix') testingClassPrefix;

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
      this.controlShouldStoreAsPrimitive = true;

      return this.args.values.split(',').map((value) => this.valuesExtractor(value));
    }

    return ret;
  }

  /**
   * The result of applying the formatValue function to the value
   * @property _formattedValue
   * @default value
   * @type {*}
   * @private
   */
  @arg(any)
  get displayValue() {
    return this.formatValue(this.value);
  }

  get _dasherizedParams() {
    return this.params
      .map((_) => _.toString())
      .map(dasherize)
      .join('_')
      .replace(/\./g, '__');
  }

  /**
   * A class which will be appended to the field for testing purpose (not styling purposes)
   * @property _testingClass
   * @type String
   * @default '--field-for__<params>'
   * @private
   */
  get _testingClass() {
    return `${this.testingClassPrefix}field-for__${this._testingSelector}`;
  }

  /**
   * A class which will be appended to the form for styling purposes using bem style
   * @property _bemClass
   * @type String
   * @default ''
   * @private
   */
  get _bemClass() {
    return this.form._bemClass ? `${this.form._bemClass}__field-for-${this._dasherizedParams}` : '';
  }

  get _testingSelector() {
    return `${this.args.form._modelName}_${this._dasherizedParams}`;
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
      (this.inlineEditing && this.hasErrors)
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

  element;

  /**
   * Options to pass to the field scroll into view
   * @property scrollIntoViewOptions
   * @type object
   * @private
   */
  @arg(object)
  scrollIntoViewOptions = { behavior: 'smooth' };

  /**
   *
   * Scrolls this element to visibile
   *
   * @method scrollToVisible
   */
  scrollToVisible() {
    this.element.scrollIntoView(
      this.scrollIntoViewOptions ?? this.form.scrollIntoViewOptions ?? {}
    );
  }

  @action
  registerElement(el) {
    this.element = el;
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
    if (isArray(value)) {
      return value.map((_) => this._stringify(_)).join(',');
    } else if (
      typeof value === 'object' &&
      !isPlainObject(value) &&
      !this.forceStringifyComparison
    ) {
      /**
       * Prevents .toJSON from being called on an ember models (deprecated)
       * All plain objects can be safely identified through JSON.stringify, while
       * anything not plain will be mapped to a universal identifier.
       */
      return guidFor(value);
    } else {
      return JSON.stringify(value);
    }
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
   * @params {Object} model Optional model to use, useful for when
   * @private
   */
  _resetField(model) {
    const form = this.args.form;

    if (this._hasCompositeValue) {
      let values = this._extractKeyValueMapping(this._lastValidValue);
      this.didResetValues(values, model);
      form.resetValues(values, model);
    } else {
      this.didResetValue(this._lastValidValue, model);
      form.resetValue(this.params[0], this._lastValidValue, model);
    }

    form.clearValidations(model);
  }

  willDestroy() {
    this.args.form.deregisterField(this);
    this.element = null;
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
  get tagName() {
    return this.form?.fieldTagName || 'div';
  }

  /**
   * The label for this field
   * @property infoText
   * @type String
   * @default null
   * @public
   */
  @arg(string)
  label = null;

  /**
   * The info-text for this field
   * @property infoText
   * @type String
   * @default null
   * @public
   */
  @arg(string)
  infoText = null;

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
  get inlineEditing() {
    return this.form?.inlineEditing || false;
  }

  /**
   * Whether or not onChange is triggered on value change
   * @property live
   * @type boolean
   * @default true
   * @public
   */
  @arg(bool)
  get live() {
    return this.form?.autoSubmit ? false : true;
  }

  /**
   * Whether or not this field requires confirmation to apply values to
   * the model
   * @property requireConfirm
   * @type boolean
   * @default false
   * @public
   */
  @arg(bool)
  get requireConfirm() {
    return this.form?.requireConfirm || false;
  }

  /**
   * Whether or not this field is required
   * the model
   * @property required
   * @type boolean
   * @default false
   * @public
   */
  @arg(bool)
  required = false;

  /**
   * Whether or not this field is disabled
   * the model
   * @property disabled
   * @type boolean
   * @default false
   * @public
   */
  @arg(bool)
  get disabled() {
    return this.form?.disabled || false;
  }

  /**
   * Whether or not this field is readonly
   * the model
   * @property readonly
   * @type boolean
   * @default false
   * @public
   */
  @arg(bool)
  get readonly() {
    return this.form?.readonly || false;
  }

  /**
   * Wether or not the fields have control callouts (popups / popovers) when in
   * inline-edit mode
   * @property hasControlCallout
   * @type Boolean
   * @default false
   * @public
   */
  @arg(bool)
  get hasControlCallout() {
    return this.form?.hasControlCallout || false;
  }

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
   * Placeholder text to display when no value is present
   * @property placeholder
   * @type String
   * @default null
   * @private
   */
  @arg(string)
  placeholder = null;

  /**
   * Edit text text to display when in inline mode and you hover over the element
   * @property editText
   * @type String
   * @default null
   * @private
   */
  @arg(string)
  editText = null;

  /**
   * Force dirty comparison using JSON
   * @property forceStringifyComparison
   * @type Boolean
   * @default false
   * @public
   */
  @arg()
  forceStringifyComparison = false;

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
   * The control name for this field to use.
   *
   * The field uses the following rubric to lookup the control for this field
   *
   * 1. It looks for a custom control in your application with a path matching ```form-controls/<@using>```
   * 2. It looks for a custom control in your application with a path matching ```form-controls/<@using>-control``` this affordance is for legacy projects and will be removed in version 3.0.0
   * 3. It looks for a pre-packaged control in foxy-forms with a path matching ```form-controls/ff-<@using>```
   *
   * @property using
   * @type String
   * @default input
   * @public
   */
  @arg(string)
  get using() {
    return this._hasCompositeValue ? 'multiple-input' : 'input';
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
    const name = this.using;
    const owner = getOwner(this);
    const lookup = owner.lookup('component-lookup:main');

    if (lookup.componentFor(`form-controls/${name}`, owner)) {
      return `form-controls/${name}`;
    } else if (lookup.componentFor(`form-controls/${name}-control`, owner)) {
      deprecate('This method of looking up form controls will be removed in version 3.0.0', true);

      return `form-controls/${name}-control`;
    } else if (lookup.componentFor(`form-controls/ff-${name}`, owner)) {
      return `form-controls/ff-${name}`;
    } else {
      throw `Could not find component ${name} in either form-controls/${name}, form-controls/${name}-control, or form-controls/ff-${name}, are you sure you've provided the correct value of @using`;
    }
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
   * Custom Label Component for rendering the label on this field
   * @property customLabelComponent
   * @type String
   * @default null
   * @public
   */
  @arg(string)
  get customLabelComponent() {
    return this.form?._customLabelComponent || '';
  }

  /**
   * Function for formatting the value override for custom behavior
   * @method formatValue
   * @param {Object} value
   * @returns {*}
   */
  @arg(func)
  formatValue = (value) => {
    if (this._hasCompositeValue) {
      return JSON.stringify(value);
    } else if (isArray(value)) {
      return value.map((v) => JSON.stringify(v));
    } else {
      return value;
    }
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
   * Triggered after the field is reset
   * @method didResetValue
   * @param {*} value
   * @public
   */
  @arg(func)
  didResetValue = (/* value */) => {};

  /**
   * Triggered after the field is reset and the field controls multiple values
   * @method didResetValues
   * @param {Object} values
   * @public
   */
  @arg(func)
  didResetValues = (/* values */) => {};

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
  formDidReset = (model) => {
    this._resetField(model);
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
      commitPromise = this.form
        .updateValues(keyValue)
        .then(() => this.didCommitValues(keyValue, prevKeyValue));
    } else {
      const newValue = this._value;
      const prevValue = this.value;
      commitPromise = this.form
        .updateValue(this.params[0], this._value)
        .then(() => this.didCommitValue(newValue, prevValue));
    }

    commitPromise.finally(() => {
      if (!this.isDestroyed && !this.hasErrors) {
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
    this._resetField(this.form.model);
    this.isEditing = false;
  }

  @action
  edit() {
    this.isEditing = true;
    later(() => {
      if (this._showControl) {
        const control = document.querySelector(`#${this.controlId}`);

        if (control) {
          control.focus();
        }
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
