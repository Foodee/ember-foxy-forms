import Component from '@glimmer/component';
import { arg, func } from 'ember-arg-types';
import { bool, string, object, boolean } from 'prop-types';
import { next } from '@ember/runloop';
import { dasherize } from '@ember/string';
import { action, setProperties, notifyPropertyChange } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { A } from '@ember/array';
import { inject as service } from '@ember/service';
import { Promise } from 'rsvp';
import { tracked } from '@glimmer/tracking';

export default class FormForComponent extends Component {
  @service formFor;
  @service router;

  constructor() {
    super(...arguments);

    this.formFor.register(this);

    if (this.parentForm) {
      this.parentForm.registerChildForm(this);
    }
  }

  /**
   * Whether or not to use ember data dirty tracking
   * @property useEmberDataDirtyTracking
   * @type boolean
   * @default false
   * @public
   */
  useEmberDataDirtyTracking = false;

  /**
   * Collection of all child field registered with this form
   * @property fields
   * @type FieldFor[]
   * @default null
   * @public
   */
  fields = A();

  /**
   * Child form. Used to connect nested form state. Currently used to coalesce dirty state from the children.
   * @property childForms
   * @type FormFor[]
   * @default null
   * @public
   */
  childForms = A();

  /**
   * The last doSubmit Promise; used to queue multiple submit requests
   * @property lastDoSubmit
   * @type Promise
   * @default null
   * @public
   */
  @tracked lastDoSubmit = null;

  /**
   * Whether or not any changes have been made to the model
   * @property isModelDirty
   * @type boolean
   * @default false
   * @public
   */
  @tracked isModelDirty = false;

  /**
   * Denotes when this particular form is submitting, an none of it's children
   * @property _isSubmitting
   * @type Boolean
   * @default false
   */
  @tracked _isSubmitting = false;

  @tracked isResetting = false;
  @tracked isDestroyingRecord = false;

  @readOnly('formFor.testingClassPrefix') testingClassPrefix;
  @readOnly('formFor.fieldClasses') fieldClasses;
  @readOnly('formFor.formClasses') formClasses;
  @readOnly('formFor.fieldForControlCalloutClasses') fieldForControlCalloutClasses;
  @readOnly('formFor.fieldForControlCalloutPosition') fieldForControlCalloutPosition;
  @readOnly('formFor.buttonClasses') buttonClasses;
  @readOnly('formFor.buttonActingClass') buttonActingClass;
  @readOnly('formFor.submitButtonClasses') submitButtonClasses;
  @readOnly('formFor.resetButtonClasses') resetButtonClasses;
  @readOnly('formFor.destroyButtonClasses') destroyButtonClasses;
  @readOnly('formFor.customCommitCancelComponent') customCommitCancelComponent;
  @readOnly('formFor.customErrorComponent') customErrorComponent;

  /**
   * Custom Label Component for rendering all labels on this form
   * @property customLabelComponent
   * @type String
   * @default null
   * @public
   */
  @arg(string)
  customLabelComponent;

  get _customLabelComponent() {
    return this.customLabelComponent || this.formFor.customLabelComponent;
  }

  get isDirty() {
    return (this.useEmberDataDirtyTracking && this.model?.hasDirtyAttributes) || this.isModelDirty;
  }

  get hasCompletedAllRequiredFields() {
    return this.fields.some((_) => _.required && _.value);
  }

  get isSubmitButtonDisabled() {
    return this.enforceRequiredFields && !this.hasCompletedAllRequiredFields;
  }

  /**
   * Computed model name
   * @property _modelName
   * @type String
   * @default 'object'
   * @public
   */
  get _modelName() {
    return dasherize(
      this.modelName ||
      this.model?.modelName ||
      this.model?._internalModel?.modelName ||
      'object'
    );
  }

  /**
   * A class which will be appended to the form for testing purpose (not styling purposes)
   * @property _testingClass
   * @type String
   * @default '--field-for__<model-name>'
   * @private
   */
  get _testingClass() {
    return `${this.testingClassPrefix}form-for__${this._modelName}`;
  }

  /**
   * Base errors for the model
   * @property errors
   * @type Error[]
   * @default []
   * @public
   */
  get errors() {
    return (this.model?.errors?.base || []).map((error) => {
      error.message = error.message.replace(/base - /i, '');

      return error;
    });
  }

  /**
   * Denotes when the form or any of it's children are submitting.
   * Manually recomputed to prevent double setting of isSubmitting while
   * childForms are registering.
   * @property isSubmitting
   * @type Boolean
   * @default false
   */
  get isSubmitting() {
    return this._isSubmitting || (this.childForms || []).some((_) => _.isSubmitting);
  }

  /**
   * Denotes whether this is the root form.
   * @property isRootForm
   * @type Boolean
   */
  get isRootForm() {
    return !this.parentForm;
  }

  get buttonComponent() {
    return this.useCustomButtonComponent && this.formFor.customButtonComponent
      ? this.formFor.customButtonComponent
      : 'form-button';
  }

  // --------------------------------------------------------------------------------
  // This section is where the DSL syntax lives

  /**
   * Model that this form controls
   * @property model
   * @type Ember.Object
   * @default null
   * @public
   */
  @arg(object)
  model = {};

  /**
   * The tag name that we use for this form
   * @property tagName
   * @type String
   * @default form
   * @public
   */
  @arg(string)
  tagName = 'form';

  /**
   * The tag name that we use for this form's fields
   * @property fieldTagName
   * @type String
   * @default form
   * @public
   */
  @arg(string)
  fieldTagName = 'div';

  /**
   * Whether or not this form is disabled
   * @property disabled
   * @type boolean
   * @default false
   * @public
   */
  @arg(bool)
  disabled = false;

  /**
   * Whether or not this form is readonly
   * @property readonly
   * @type boolean
   * @default false
   * @public
   */
  @arg(bool)
  readonly = false;

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
   * Whether or not this form requires confirmation to apply values to
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
   * Whether or not this form notifies of its success by way of the formFor service
   * @property notifyOfSuccess
   * @type boolean
   * @default true
   * @public
   */
  @arg(bool)
  notifyOfSuccess = true;

  /**
   * Whether or not this form notifies of its error by way of the formFor service
   * @property notifyOfError
   * @type boolean
   * @default true
   * @public
   */
  @arg(bool)
  notifyOfError = true;

  /**
   * The message to send on submit success
   * @property successfulSubmitMessage
   * @type String
   * @default null
   * @public
   */
  @arg
  successfulSubmitMessage = null;

  /**
   * The message to send on submit error
   * @property failedSubmitMessage
   * @type String
   * @default null
   * @public
   */
  @arg
  failedSubmitMessage = null;

  /**
   * The message to send when the model did not submit
   * @property didNotSubmitMessage
   * @type String
   * @default null
   * @public
   */
  @arg
  didNotSubmitMessage = null;

  /**
   * The message to send on reset success
   * @property successfulResetMessage
   * @type String
   * @default null
   * @public
   */
  @arg
  successfulResetMessage = null;

  /**
   * The message to send on reset error
   * @property reset-error-message
   * @type String
   * @default null
   * @public
   */
  @arg
  failedResetMessage = null;

  /**
   * The message to send when model did not reset
   * @property didNotResetMessage
   * @type String
   * @default null
   * @public
   */
  @arg
  didNotResetMessage = null;

  /**
   * Whether or not to confirm destruction
   * @property confirmDestroy
   * @type Boolean
   * @default true
   * @public
   */
  @arg(boolean)
  confirmsDestroy = true;

  /**
   * The message displayed to confirm destruction
   * @property confirmDestroyMessage
   * @type String
   * @default null
   * @public
   */
  @arg
  confirmDestroyMessage = null;

  /**
   * The message to send on destroy success
   * @property successfulDestroyMessage
   * @type String
   * @default null
   * @public
   */
  @arg
  successfulDestroyMessage = null;

  /**
   * The message to send on destroy error
   * @property failedDestroyMessage
   * @type String
   * @default null
   * @public
   */
  @arg
  failedDestroyMessage = null;

  /**
   * Whether or not the form automatically submits on value changes
   * @property autoSubmit
   * @type Boolean
   * @default false
   * @public
   */
  @arg(bool)
  autoSubmit = false;

  /**
   * Whether or not the form automatically prevents navigation when the model is dirty
   * @property preventsNavigation
   * @type Boolean
   * @default true
   * @public
   */
  @arg(bool)
  get preventsNavigation() {
    return this.formFor.preventsNavigationByDefault ?? false;
  }

  /**
   * Parent form. Used to connect nested form state. Currently used to propagate dirty state to parent.
   * @property parentForm
   * @type FormFor
   * @default null
   * @public
   */
  @arg(object)
  parentForm = null;

  /**
   * Options to be passed to the validation if using validators
   * @property validationOptions
   * @type Object
   * @default {}
   * @public
   */
  @arg(object)
  validationOptions = {};

  /**
   * Allows multiple submit calls to be queued
   * @property allow-submit-enqueue
   * @type Boolean
   * @default false
   * @public
   */
  @arg(bool)
  allowSubmitQueue = false;

  @arg(string)
  modelName = null;

  @arg(boolean)
  useCustomButtonComponent = true;

  @arg(bool)
  enforceRequiredFields = false;

  /**
   * Resets the dirty model properties to their previous values on the form destruction. Turning this off will
   * leave the model in a dirty state, even when the user navigates away.
   * @property reset-on-destroy
   * @type Boolean
   * @default true
   * @public
   */
  @arg(bool)
  resetOnDestroy = true;

  /**
   * If true, resets the form when confirmation is not provided
   *
   * @property resetOnRejectedConfirm
   * @type Boolean
   * @default true
   * @public
   */
  @arg(bool)
  resetOnRejectedConfirm = true;

  // --------------------------------------------------------------------------------
  // Methods
  //

  /**
   * Called before the form submits, this is where we do
   * validation
   * @method willSubmit
   * @param {Object} [model]
   * @return {boolean|Promise<Boolean>}
   * @public
   */
  @arg(func)
  willSubmit = (_model) => {
    return this.runValidations();
  };


  /**
   * Called before the form submits, this is where we might confirm
   *
   * @method willSubmit
   * @param {Object} [model]
   * @return {Promise<boolean>}
   * @public
   */
  @arg(func)
  confirmSubmit = (_model) => {
    return Promise.resolve(true);
  };

  /**
   * Called when will submit returned false
   * @method didNotSubmit
   * @param {Object} [model]
   * @public
   */
  @arg(func)
  didNotSubmit = () => {
  };

  /**
   * Called when the submit action is called
   * @method onSubmit
   * @param {Object} model
   * @return {Promise.<Object>}
   * @public
   */
  @arg(func)
  onSubmit = (model) => {
    return model?.save ? model.save() : Promise.resolve(model);
  };

  /**
   * Called when a child of this form's onSubmit is fulfilled
   * @method didSubmit
   * @param {Object} model
   * @public
   */
  @arg(func)
  childDidSubmit = (/*model*/) => {
  };

  /**
   * Called when a child of this form's onSubmit is reject
   * @method didSubmit
   * @param {Object} model
   * @public
   */
  @arg(func)
  childFailedSubmit = (/*model*/) => {
  };

  /**
   * Called when the onSubmit is fulfilled
   * @method didSubmit
   * @param {Object} model
   * @public
   */
  @arg(func)
  didSubmit = (/*model*/) => {
  };

  /**
   * Called when the onSubmit is rejected
   * @method failedSubmit
   * @param {Object} reason
   * @public
   */
  @arg(func)
  failedSubmit = (/*reason*/) => {
  };

  /**
   * Called before the form submits, this is where we might confirm
   *
   * @method confirmReset
   * @param {Object} [model]
   * @return {Promise<boolean>}
   * @public
   */
  @arg(func)
  confirmReset = (_model) => {
    return Promise.resolve(true);
  };

  /**
   * Called before the form resets
   * @method willReset
   * @param {Object} model
   * @return {boolean|Promise<Boolean>}
   * @public
   */
  @arg(func)
  willReset = (/*model*/) => {
    return true;
  };

  /**
   * Called when will reset returned false
   * @method didNotReset
   * @param {Object} model
   * @public
   */
  @arg(func)
  didNotReset = (/*model*/) => {
  };

  /**
   * Called when the reset action is called
   * @method onReset
   * @param {Object} [model]
   * @return {Promise.<Object>}
   * @public
   */
  @arg(func)
  onReset = (model) => {
    return Promise.resolve(model);
  };

  /**
   * Called when the onReset is fulfilled
   * @method didReset
   * @param {Object} model
   * @public
   */
  @arg(func)
  didReset = (/*model*/) => {
  };

  /**
   * Called when the onReset is rejected
   * @method failedReset
   * @param {Object} reason
   * @public
   */
  @arg(func)
  failedReset = (/*reason*/) => {
  };

  /**
   * Called when values are updated in the form. Useful for knowing when a field has
   * has changed without having to reach into individual fields or controls.
   * @method updateValues
   * @param {Object} keyValues
   * @public
   */
  @arg(func)
  onUpdateValues = (/*keyValues*/) => {
  };

  /**
   * Called when the form is marked dirty
   * @method onMarkedDirty
   * @public
   */
  @arg(func)
  onMarkedDirty = () => {
  };

  /**
   * Called when the form is marked clean
   * @method onMarkedClean
   * @public
   */
  @arg(func)
  onMarkedClean = () => {
  };

  @arg(func)
  willDestroyModel = () => {
    return true;
  };

  /**
   * Called when the onDestroy is fulfilled
   * @method didDestroy
   * @public
   */
  @arg(func)
  didDestroyModel = () => {
  };

  /**
   * Called when will destroy returned false
   * @method didNotDestroy
   * @param {Object} [model]
   * @public
   */
  @arg(func)
  didNotDestroyModel = () => {
  };

  /**
   * Called when the onDestroy is fulfilled
   * @method failedDestroy
   * @param {Object} reason
   * @public
   */
  @arg(func)
  failedDestroyModel = (/* reason */) => {
  };

  @arg(func)
  notifySuccess = (message) => {
    if (message && this.notifyOfSuccess) {
      this.formFor.notifySuccess(message);
    }
  };

  @arg(func)
  notifyError = (message) => {
    if (message && this.notifyOfError) {
      this.formFor.notifyError(message);
    }
  };

  /**
   * Runs model validations if they are present
   * @method runValidations
   * @return {boolean}
   * @public
   */
  @arg(func)
  runValidations = (validationOptions = null) => {
    const model = this.model;
    return model?.validate ? model.validate(validationOptions || this.validationOptions) : true;
  };

  /**
   * Clears the validations on the model
   * @method clearValidations
   * @public
   */
  @arg(func)
  clearValidations = () => {
    const model = this.model;
    return model.validate && model.validate({only: []});
  };

  /**
   * Used to inform parent forms that either this form, or one of its children submitted
   * @method notifyChildFailedSubmit
   * @param {FormFor} originator
   * @public
   */
  notifyChildDidSubmit(originator) {
    if (this !== originator) {
      this.childDidSubmit(originator);
    }

    if (this.parentForm) {
      this.parentForm.notifyChildDidSubmit();
    }
  }

  /**
   * Used to inform parent forms that either this form, or one of its children failed
   * submission
   * @method notifyChildFailedSubmit
   * @param {FormFor} originator
   * @public
   */
  notifyChildFailedSubmit(originator) {
    if (this !== originator) {
      this.childFailedSubmit(originator);
    }

    if (this.parentForm) {
      this.parentForm.notifyChildFailedSubmit();
    }
  }

  /**
   * Action that actual does the submitting
   * @method doSubmit
   * @public
   */
  async doSubmit() {
    const lastDoSubmit = this.lastDoSubmit;

    const model = this.model;
    const isSaving = model?.isSaving;

    // Guard if the model is saving
    const willSubmit = !isSaving ? (await this.willSubmit(model)) : false;
    const confirmSubmit = await this.confirmSubmit(model);

    if (willSubmit && confirmSubmit || this.allowSubmitQueue) {
      this._markSubmitting();

      const onSubmit =
        this.allowSubmitQueue && lastDoSubmit
          ? lastDoSubmit.then(() => this.onSubmit(model))
          : this.onSubmit(model);

      const doSubmit = onSubmit
        .then(() => {
          if (this.isRootForm) {
            return this.submitChildForms(this.childForms);
          }
        })
        .then(() => {
          this.notifySuccess(this.successfulSubmitMessage);
          this.didSubmit();
          this.notifyChildDidSubmit(false);
          this._markClean();
          this._runFieldDidSubmit();
          this._hasFailedToSubmit = false;
          this.notifyChildDidSubmit(this);
        })
        .catch((_) => {
          this.notifyError(this.failedSubmitMessage);
          this.failedSubmit(_);
          this.notifyChildFailedSubmit(this);
          return Promise.reject(_);
        })
        .finally(() => {
          this._unmarkSubmitting();
        });

      this.lastDoSubmit = doSubmit;

      return doSubmit;
      // somehow we set out selves to the last do submit?
    } else {
      this._hasFailedToSubmit = true;
      this.didNotSubmit(model);
      this.notifyError(this.didNotSubmitMessage);

      if(!confirmSubmit && this.resetOnRejectedConfirm) {
        await this.doReset();
      }

      return Promise.resolve(true);
    }
  }


  /**
   * Breadth first submission down the form tree, ensures that parent forms get submitted before child forms.
   * Only submits forms that are dirty.
   * @method submitChildForms
   * @param {FormFor[]} childForms
   * @param {Promise} parentPromise
   * @returns {Promise}
   */
  submitChildForms(childForms, parentPromise = Promise.resolve()) {
    childForms = childForms || [];

    if (!childForms.length) {
      return parentPromise;
    }

    const dirtyChildren = childForms.filter(
      (_) => _.isModelDirty || _.model.isDeleted || _.model.isNew
    );

    const newPromise = parentPromise.then(() =>
      Promise.all(dirtyChildren.map((_) => _.doSubmit()))
    );

    const nextDepth = Promise.all(
      childForms.map((_) => this.submitChildForms(_.childForms, newPromise))
    );

    return nextDepth;
  }

  /**
   * Action that actual does the resetting
   * @method doReset
   * @public
   */
  async doReset() {
    const model = this.model;
    let shouldReset = await this.willReset(model);
    shouldReset &&= await this.confirmReset(model);
    if (shouldReset) {
      try {
        this.isResetting = true;
        await this.onReset();
        this.notifySuccess(this.successfulResetMessage);
        this.didReset();
        this._runFieldDidReset();
        this._markClean();
      } catch (e) {
        this.notifyError(this.failedResetMessage);
        this.failedReset(e);
      } finally {
        this.isResetting = false;
      }
    } else {
      this.didNotReset(model);
      this.notifyError(this.didNotResetMessage);
    }
  }

  /**
   * Updates a value on the model
   * @method updateValueFn
   * @param {String} key
   * @param {*} value
   * @public
   */
  updateValueFn(key, value) {
    // better code reuse this way
    return this.updateValues({[key]: value});
  }

  /**
   * Updates a collection of values on the model
   * @method updateValuesFn
   * @param {Object} keyValues
   * @public
   */
  updateValuesFn(keyValues) {
    this._checkClean();

    if (this.model?.setProperties) {
      this.model.setProperties(keyValues);
    } else {
      setProperties(this.model, keyValues);
    }

    if (this._hasFailedToSubmit) {
      next(() => this.runValidations());
    }

    this.onUpdateValues(keyValues);

    return this.autoSubmit ? this.doSubmit() : Promise.resolve(true);
  }

  _checkClean() {
    next(() => {
      const fields = this.fields || [];
      const childForms = this.childForms || [];
      const dirtyChildModels = this.dirtyChildModels || [];

      const cleanFields = fields.every((_) => !_.isReallyDirty);
      const cleanForms = childForms.every((_) => !_.isModelDirty);
      const noDirtyChildModels = !dirtyChildModels.length;

      if (cleanFields && cleanForms && noDirtyChildModels) {
        this._markClean();
      } else {
        this._markDirty();
      }

      if (this.parentForm) {
        this.parentForm._checkClean();
      }
    });
  }

  resetValues(keyValues) {
    if (this.model.setProperties) {
      this.model.setProperties(keyValues);
    } else {
      setProperties(this.model, keyValues);
    }

    this._checkClean();
  }

  resetValue(key, value) {
    this.resetValues({[key]: value});
  }

  /**
   * Marks the form as dirty
   * @method _markDirty
   * @private
   */
  _markDirty() {
    if (!this.isDestroyed) {
      this.isModelDirty = true;
      this.onMarkedDirty(this.model);
    }
  }

  /**
   * Marks the form as clean
   * @method _markClean
   * @private
   */
  _markClean() {
    if (!this.isDestroyed) {
      this.isModelDirty = false;
      this.onMarkedClean(this.model);
    }
  }

  /**
   * Marks the form as submitting
   * @method _markSubmitting
   * @private
   */
  _markSubmitting() {
    this._isSubmitting = true;
    this._recomputeIsSubmitting();
  }

  /**
   * Unmarks the form as submitting
   * @method _unmarkSubmitting
   * @private
   */
  _unmarkSubmitting() {
    this._isSubmitting = false;
    this._recomputeIsSubmitting();
  }

  /**
   * Manual property change notification is required because if
   * we watch the children's forms child form registration will cause
   * isSubmitting to be set twice during a single render.
   * @method _recomputeIsSubmitting
   * @private
   */
  _recomputeIsSubmitting() {
    notifyPropertyChange(this, 'isSubmitting');

    if (this.parentForm) {
      this.parentForm._recomputeIsSubmitting();
    }
  }

  /**
   * Runs the callback for did submit on all of the fields
   * @method _runFieldDidSubmit
   * @private
   */
  _runFieldDidSubmit() {
    (this.fields || []).forEach((_) => _.formDidSubmit());
  }

  /**
   * Runs the callback for did reset on all of the fields
   * @method _runFieldDidReset
   * @private
   */
  _runFieldDidReset() {
    (this.fields || []).forEach((_) => _.formDidReset());
  }

  /**
   * Registers a field with the form
   * @method registerField
   * @param {FieldFor} field
   * @public
   */
  registerField(field) {
    const fields = this.fields || {};
    fields.push(field);
    this.fields = fields;
  }

  /**
   * deregisters a field with the form
   * @method deregisterField
   * @param {FieldFor} field
   * @public
   */
  deregisterField(field) {
    if (!this.isDestroying) {
      const fields = this.fields || {};
      fields.removeObject(field);
      this.fields = fields;
    }
  }

  /**
   * Registers a child form with it's parent
   * @method registerChildForm
   * @param {FormFor} form
   * @public
   */
  registerChildForm(form) {
    this.childForms.push(form);
  }

  /**
   * deregisters a child form with it's parent
   * @method deregisterChildForm
   * @param {FormFor} form
   * @public
   */
  deregisterChildForm(form) {
    if (!this.isDestroying) {
      this.childForms.removeObject(form);
    }
  }

  willDestroy() {
    if (this.isDirty && this.resetOnDestroy) {
      this.doReset();
    }

    if (this.parentForm) {
      this.parentForm.deregisterChildForm(this);
    }

    return this.formFor.deregister(this);
  }

  @action
  submit() {
    this.doSubmit();
  }

  @action
  reset() {
    this.doReset();
  }

  @action
  alternativeSubmit() {
    if (this.tagName !== 'form') {
      this.submit();
    }
  }

  /**
   * Called to confirm the destruction of the model
   * @method confirmDestroy
   * @param {Object} model
   * @public
   */
  @action
  confirmDestroy(model) {
    this.isDestroyingRecord = true;

    if (this.willDestroyModel()) {
      const promise = this.confirmsDestroy
        ? this.formFor.confirmDestroy(model, this.confirmDestroyMessage)
        : this.model.destroyRecord
          ? this.model.destroyRecord()
          : Promise.resolve(this.model);

      promise
        .then(() => {
          this.notifySuccess(this.successfulDestroyMessage);

          this.didDestroyModel();
        })
        .catch((_) => {
          this.notifyError(this.failedDestroyMessage);
          this.failedDestroyModel(_);
        })
        .finally(() => !this.isDestroyed && (this.isDestroyingRecord = false));
    } else {
      this.didNotDestroyModel();
    }
  }

  @action
  updateValue(key, value) {
    return this.updateValueFn(key, value);
  }

  @action
  updateValues(keyValues) {
    return this.updateValuesFn(keyValues);
  }
}
