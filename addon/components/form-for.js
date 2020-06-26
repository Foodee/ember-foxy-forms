import Component from '@glimmer/component';
import { arg } from 'ember-arg-types';
import { bool, string, array, object } from 'prop-types';
import { next } from '@ember/runloop';
import { dasherize } from '@ember/string';
import EmberObject, { action, setProperties } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { A } from '@ember/array';
import { inject as service } from '@ember/service';
import { Promise } from 'rsvp';

export default class FormForComponent extends Component {
  @service formFor;
  @service router;

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
  @arg(string)
  successfulSubmitMessage = null;

  /**
   * The message to send on submit error
   * @property failedSubmitMessage
   * @type String
   * @default null
   * @public
   */
  @arg(string)
  failedSubmitMessage = null;

  /**
   * The message to send when the model did not submit
   * @property didNotSubmitMessage
   * @type String
   * @default null
   * @public
   */
  @arg(string)
  didNotSubmitMessage = null;

  /**
   * The message to send on reset success
   * @property successfulResetMessage
   * @type String
   * @default null
   * @public
   */
  @arg(string)
  successfulResetMessage = null;

  /**
   * The message to send on reset error
   * @property reset-error-message
   * @type String
   * @default null
   * @public
   */
  @arg(string)
  failedResetMessage = null;

  /**
   * The message to send when model did not reset
   * @property didNotResetMessage
   * @type String
   * @default null
   * @public
   */
  @arg(string)
  didNotResetMessage = null;

  /**
   * The message displayed to confirm destruction
   * @property confirmDestroyMessage
   * @type String
   * @default null
   * @public
   */
  @arg(string)
  confirmDestroyMessage = null;

  /**
   * The message to send on destroy success
   * @property successfulDestroyMessage
   * @type String
   * @default null
   * @public
   */
  @arg(string)
  successfulDestroyMessage = null;

  /**
   * The message to send on destroy error
   * @property failedDestroyMessage
   * @type String
   * @default null
   * @public
   */
  @arg(string)
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
   * @default false
   * @public
   */
  @arg(bool)
  preventsNavigation = false;

  /**
   * Parent form. Used to connect nested form state. Currently used to propagate dirty state to parent.
   * @property parentForm
   * @type FormFor
   * @default null
   * @public
   */
  @arg(string)
  parentForm = null;

  /**
   * Child form. Used to connect nested form state. Currently used to coalesce dirty state from the children.
   * @property childForms
   * @type FormFor[]
   * @default null
   * @public
   */
  @arg(array)
  childForms = null;

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
  @arg(string)
  allowSubmitQueue = false;

  constructor() {
    super(...arguments);

    if (this.args.preventsNavigation) {
      this.handleWilltransition = (transition) => {
        const isDirty =
          (this.useEmberDataDirtyTracking && this.model.hasDirtyAttributes) || this.isModelDirty;

        if (isDirty && !confirm('You have unsaved changes, are you sure you want to leave?')) {
          transition.abort();
        }
      };

      // in test environments that are not acceptance, we won't have real router

      if (this.router && this.router.on) {
        this.router.on('willTransition', this, this.handleWilltransition);
      }

      // prevent browser reloads
      window.onbeforeunload = () => {
        const isDirty =
          (this.useEmberDataDirtyTracking && this.model.hasDirtyAttributes) || this.isModelDirty;

        if (isDirty) {
          return 'You have unsaved changes, are you sure you want to leave?';
        }
      };
    }

    if (this.args.parentForm) {
      this.args.parentForm.registerChildForm(this);
    }
  }

  get tagName() {
    return this.args.tagName || 'form';
  }

  @readOnly('formFor.testingClassPrefix') testingClassPrefix;
  @readOnly('formFor.fieldClasses') fieldClasses;
  @readOnly('formFor.formClasses') formClasses;
  @readOnly('formFor.fieldForControlCalloutClasses')
  fieldForControlCalloutClasses;
  @readOnly('formFor.fieldForControlCalloutPosition')
  fieldForControlCalloutPosition;
  @readOnly('formFor.buttonClasses') buttonClasses;
  @readOnly('formFor.submitButtonClasses') submitButtonClasses;
  @readOnly('formFor.resetButtonClasses') resetButtonClasses;
  @readOnly('formFor.customCommitCancelComponent') customCommitCancelComponent;
  @readOnly('formFor.customErrorComponent') customErrorComponent;

  /**
   * Collection of all child field registered with this form
   * @property fields
   * @type FieldFor[]
   * @default null
   * @public
   */
  fields = A();

  /**
   * Model that this form controls
   * @property model
   * @type Ember.Object
   * @default null
   * @public
   */
  get model() {
    return this.args.model || EmberObject.create();
  }

  @arg(string)
  modelName = null;

  /**
   * Whether or not any changes have been made to the model
   * @property isModelDirty
   * @type boolean
   * @default false
   * @public
   */
  isModelDirty = false;

  /**
   * Whether or not to use ember data dirty tracking
   * @property useEmberDataDirtyTracking
   * @type boolean
   * @default false
   * @public
   */
  useEmberDataDirtyTracking = false;

  /**
   * The last doSubmit Promise; used to queue multiple submit requests
   * @property lastDoSubmit
   * @type Promise
   * @default null
   * @public
   */
  lastDoSubmit = null;

  /**
   * Computed model name
   * @property _modelName
   * @type String
   * @default 'object'
   * @public
   */
  get _modelName() {
    return dasherize(
      this.args.modelName ||
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
    return this._isSubmitting || (this.args.childForms || []).some((_) => _.isSubmitting);
  }

  /**
   * Denotes whether this is the root form.
   * @property isRootForm
   * @type Boolean
   */
  get isRootForm() {
    return !this.args.parentForm;
  }

  /**
   * Denotes when this particular form is submitting, an none of it's children
   * @property _isSubmitting
   * @type Boolean
   * @default false
   */
  _isSubmitting = false;

  // --------------------------------------------------------------------------------
  // This section is where the DSL syntax lives

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
    const model = this.model;
    return model.validate ? model.validate(validationOptions || this.args.validationOptions) : true;
  }

  /**
   * Clears the validations on the model
   * @method clearValidations
   * @public
   */
  clearValidations() {
    const model = this.model;
    return model.validate && model.validate({ only: [] });
  }

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
  }

  /**
   * Called when will submit returned false
   * @method didNotSubmit
   * @param {Object} [model]
   * @public
   */
  didNotSubmit() {}

  /**
   * Called when the submit action is called
   * @method onSubmit
   * @param {Object} model
   * @return {Promise.<Object>}
   * @public
   */
  onSubmit(model) {
    return model.save ? model.save() : Promise.resolve(model);
  }

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

    if (this.args.parentForm) {
      this.args.parentForm.notifyChildDidSubmit();
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

    if (this.args.parentForm) {
      this.args.parentForm.notifyChildFailedSubmit();
    }
  }

  /**
   * Called when a child of this form's onSubmit is fulfilled
   * @method didSubmit
   * @param {Object} model
   * @public
   */
  childDidSubmit(/*model*/) {}

  /**
   * Called when a child of this form's onSubmit is reject
   * @method didSubmit
   * @param {Object} model
   * @public
   */
  childFailedSubmit(/*model*/) {}

  /**
   * Called when the onSubmit is fulfilled
   * @method didSubmit
   * @param {Object} model
   * @public
   */
  didSubmit(/*model*/) {}

  /**
   * Called when the onSubmit is rejected
   * @method failedSubmit
   * @param {Object} reason
   * @public
   */
  failedSubmit(/*reason*/) {}

  /**
   * Action that actual does the submitting
   * @method doSubmit
   * @public
   */
  doSubmit() {
    const lastDoSubmit = this.lastDoSubmit;

    const model = this.model;
    const isSaving = model.isSaving;

    // Guard if the model is saving
    if ((!isSaving && this.willSubmit(model)) || this.args.allowSubmitQueue) {
      this._markSubmitting();

      const onSubmit =
        this.args.allowSubmitQueue && lastDoSubmit
          ? lastDoSubmit.then(() => this.onSubmit(model))
          : this.onSubmit(model);

      const doSubmit = onSubmit
        .then(() => {
          if (this.isRootForm) {
            return this.submitChildForms(this.args.childForms);
          }
        })
        .then(() => {
          this.notifySuccess(this.args.successfulSubmitMessage);
          this.didSubmit();
          this.notifyChildDidSubmit(false);
          this._markClean();
          this._runFieldDidSubmit();
          this._hasFailedToSubmit = false;
          this.notifyChildDidSubmit(this);
        })
        .catch((_) => {
          this.notifyError(this.args.failedSubmitMessage);
          this.failedSubmit(_);
          this.notifyChildFailedSubmit(this);
          return Promise.reject(_);
        })
        .finally(() => {
          this._unmarkSubmitting();
        });

      this.lastDoSubmit = doSubmit;

      return doSubmit;
    } else {
      this._hasFailedToSubmit = true;
      this.didNotSubmit(model);
      this.notifyError(this.args.didNotSubmitMessage);

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
   * Called before the form resets
   * @method willReset
   * @param {Object} model
   * @return boolean
   * @public
   */
  willReset(/*model*/) {
    return true;
  }

  /**
   * Called when will reset returned false
   * @method didNotReset
   * @param {Object} model
   * @public
   */
  didNotReset(/*model*/) {}

  /**
   * Called when the reset action is called
   * @method onReset
   * @param {Object} [model]
   * @return {Promise.<Object>}
   * @public
   */
  onReset(model) {
    return Promise.resolve(model);
  }

  /**
   * Called when the onReset is fulfilled
   * @method didReset
   * @param {Object} model
   * @public
   */
  didReset(/*model*/) {}

  /**
   * Called when the onReset is rejected
   * @method failedReset
   * @param {Object} reason
   * @public
   */
  failedReset(/*reason*/) {}

  /**
   * Called when values are updated in the form. Useful for knowing when a field has
   * has changed without having to reach into individual fields or controls.
   * @method updateValues
   * @param {Object} keyValues
   * @public
   */
  onUpdateValues(/*keyValues*/) {}

  /**
   * Called when the form is marked dirty
   * @method onMarkedDirty
   * @public
   */
  onMarkedDirty() {}

  /**
   * Called when the form is marked clean
   * @method onMarkedClean
   * @public
   */
  onMarkedClean() {}

  /**
   * Action that actual does the resetting
   * @method doReset
   * @public
   */
  doReset() {
    const model = this.model;

    if (this.willReset(model)) {
      this.isResetting = true;

      this.onReset()
        .then(() => {
          this.notifySuccess(this.args.successfulResetMessage);
          this.didReset();
          this._runFieldDidReset();
          this._markClean();
        })
        .catch((_) => {
          this.notifyError(this.args.failedResetMessage);
          this.failedReset(_);
        })
        .finally(() => (this.isResetting = false));
    } else {
      this.didNotReset(model);
      this.notifyError(this.args.didNotResetMessage);
    }
  }

  /**
   * Called when the onDestroy is fulfilled
   * @method didDestroy
   * @public
   */
  didDestroy() {}

  /**
   * Called when the onDestroy is fulfilled
   * @method failedDestroy
   * @param {Object} reason
   * @public
   */
  failedDestroy(/* reason */) {}

  /**
   * Called to confirm the destruction of the model
   * @method confirmDestroy
   * @param {Object} model
   * @public
   */
  confirmDestroy(model) {
    this.isDestroyingRecord = true;
    this.formFor
      .confirmDestroy(model, this.args.confirmDestroyMessage)
      .then(() => {
        this.notifySuccess(this.args.successfulDestroyMessage);
        this.didDestroy();
      })
      .catch((_) => {
        this.notifyError(this.args.failedDestroyMessage);
        this.failedDestroy(_);
      })
      .finally(() => !this.isDestroyed && (this.isDestroyingRecord = false));
  }

  notifySuccess(message) {
    if (message && this.args.notifyOfSuccess) {
      this.formFor.notifySuccess(message);
    }
  }

  notifyError(message) {
    if (message && this.args.notifyOfError) {
      this.formFor.notifyError(message);
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
    return this.updateValues({ [key]: value });
  }

  /**
   * Updates a collection of values on the model
   * @method updateValuesFn
   * @param {Object} keyValues
   * @public
   */
  updateValuesFn(keyValues) {
    this._checkClean();

    if (this.model.setProperties) {
      this.model.setProperties(keyValues);
    } else {
      setProperties(this.model, keyValues);
    }

    if (this._hasFailedToSubmit) {
      next(() => this.runValidations());
    }

    this.onUpdateValues(keyValues);

    return this.args.autoSubmit ? this.doSubmit() : Promise.resolve(true);
  }

  _checkClean() {
    next(() => {
      const fields = this.fields || [];
      const childForms = this.args.childForms || [];
      const dirtyChildModels = this.dirtyChildModels || [];

      const cleanFields = fields.every((_) => !_.isReallyDirty);
      const cleanForms = childForms.every((_) => !_.isModelDirty);
      const noDirtyChildModels = !dirtyChildModels.length;

      if (cleanFields && cleanForms && noDirtyChildModels) {
        this._markClean();
      } else {
        this._markDirty();
      }

      if (this.args.parentForm) {
        this.args.parentForm._checkClean();
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
    this.resetValues({ [key]: value });
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
    this.notifyPropertyChange('isSubmitting');

    if (this.args.parentForm) {
      this.args.parentForm._recomputeIsSubmitting();
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
    const fields = this.fields || [];
    fields.push(field);
    this.fields = fields;
  }

  /**
   * Unregisters a field with the form
   * @method unregisterField
   * @param {FieldFor} field
   * @public
   */
  unregisterField(field) {
    const fields = this.fields || [];
    fields.removeObject(field);
    this.fields = fields;
  }

  /**
   * Registers a child form with it's parent
   * @method registerChildForm
   * @param {FormFor} form
   * @public
   */
  registerChildForm(form) {
    const childForms = this.args.childForms || [];
    childForms.push(form);
    this.args.childForms = childForms;
  }

  /**
   * Unregisters a child form with it's parent
   * @method unregisterChildForm
   * @param {FormFor} form
   * @public
   */
  unregisterChildForm(form) {
    const childForms = this.args.childForms || [];
    childForms.removeObject(form);
    this.args.childForms = childForms;
  }

  willDestroyElement() {
    window.onbeforeunload = null;

    // in test environments that are not acceptance, we won't have real router
    let router = this.router;
    if (router && router.off && this.handleWilltransition) {
      router.off('willTransition', this, this.handleWilltransition);
    }

    if (this.args.parentForm) {
      this.args.parentForm.unregisterChildForm(this);
    }
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
  updateValue(key, value) {
    return this.updateValueFn(key, value);
  }

  @action
  updateValues(keyValues) {
    return this.updateValuesFn(keyValues);
  }
}
