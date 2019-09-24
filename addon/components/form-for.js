import Ember from 'ember';
import layout from '../templates/components/form-for';

const {
  RSVP: {Promise},
  inject: {service},
  computed,
  get,
  getOwner,
  setProperties,
} = Ember;

const FormFor = Ember.Component.extend({

  layout,

  formFor: service(),

  router: service('-routing'),

  config: computed(function () {
    return Object.assign({}, getOwner(this).resolveRegistration('config:environment').APP['ember-foxy-forms']);
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
   * Whether or not any changes have been made to the model
   * @property isModelDirty
   * @type boolean
   * @default false
   * @public
   */
  isModelDirty: false,


  /**
   * Whether or not to use ember data dirty tracking
   * @property useEmberDataDirtyTracking
   * @type boolean
   * @default false
   * @public
   */
  useEmberDataDirtyTracking: false,


  /**
   * The last doSubmit Promise; used to queue multiple submit requests
   * @property lastDoSubmit
   * @type Promise
   * @default null
   * @public
   */
  lastDoSubmit: null,

  /**
   * Computed model name
   * @property _modelName
   * @type String
   * @default 'object'
   * @public
   */
  _modelName: computed('model', 'model-name', function () {
    const model = this.get('model');
    let modelName = 'object';

    if (model) {
      modelName = this.get('model-name') ||
        get(model, 'modelName') ||
        get(model, '_internalModel.modelName') ||
        'object';
    }

    return Ember.String.dasherize(modelName);
  }),

  /**
   * A class which will be appended to the form for testing purpose (not styling purposes)
   * @property _testingClass
   * @type String
   * @default '--field-for__<model-name>'
   * @private
   */
  _testingClass: computed('model', function () {
    return `${this.get('config.testingClassPrefix')}form-for__${this.get('_modelName')}`;
  }),


  /**
   * Base errors for the model
   * @property errors
   * @type Error[]
   * @default []
   * @public
   */
  errors: computed('model.errors.base', function () {
    return (this.get('model.errors.base') || [])
      .map(error => {
        error.message = error.message.replace(/base - /i, '');

        return error;
      });
  }),

  /**
   * Denotes when the form or any of it's children are submitting.
   * Manually recomputed to prevent double setting of isSubmitting while
   * child-forms are registering.
   * @property isSubmitting
   * @type Boolean
   * @default false
   */
  isSubmitting: computed(function() {
    return this.get('_isSubmitting') || (this.get('child-forms') || []).some(_ => _.get('isSubmitting'));
  }),

  /**
   * Denotes whether this is the root form.
   * @property isRootForm
   * @type Boolean
   */
  isRootForm: computed('parent-form', function() {
    return !this.get('parent-form');
  }),

  /**
   * Denotes when this particular form is submitting, an none of it's children
   * @property _isSubmitting
   * @type Boolean
   * @default false
   */
  _isSubmitting: false,

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
   * @property successful-submit-message
   * @type String
   * @default null
   * @public
   */
  'successful-submit-message': null,

  /**
   * The message to send on submit error
   * @property failed-submit-message
   * @type String
   * @default null
   * @public
   */
  'failed-submit-message': null,

  /**
   * The message to send when the model did not submit
   * @property did-not-submit-message
   * @type String
   * @default null
   * @public
   */
  'did-not-submit-message': null,

  /**
   * The message to send on reset success
   * @property successful-reset-message
   * @type String
   * @default null
   * @public
   */
  'successful-reset-message': null,

  /**
   * The message to send on reset error
   * @property reset-error-message
   * @type String
   * @default null
   * @public
   */
  'failed-reset-message': null,

  /**
   * The message to send when model did not reset
   * @property did-not-reset-message
   * @type String
   * @default null
   * @public
   */
  'did-not-reset-message': null,

  /**
   * The message displayed to confirm destruction
   * @property confirm-destroy-message
   * @type String
   * @default null
   * @public
   */
  'confirm-destroy-message': null,

  /**
   * The message to send on destroy success
   * @property successful-destroy-message
   * @type String
   * @default null
   * @public
   */
  'successful-destroy-message': null,

  /**
   * The message to send on destroy error
   * @property failed-destroy-message
   * @type String
   * @default null
   * @public
   */
  'failed-destroy-message': null,

  /**
   * Whether or not the form automatically submits on value changes
   * @property auto-submit
   * @type Boolean
   * @default false
   * @public
   */
  'auto-submit': false,

  /**
   * Whether or not the form automatically prevents navigation when the model is dirty
   * @property prevents-navigation
   * @type Boolean
   * @default false
   * @public
   */
  'prevents-navigation': false,



  /**
   * Parent form. Used to connect nested form state. Currently used to propagate dirty state to parent.
   * @property parent-form
   * @type FormFor
   * @default null
   * @public
   */
  'parent-form': null,

  /**
   * Child form. Used to connect nested form state. Currently used to coalesce dirty state from the children.
   * @property child-forms
   * @type FormFor[]
   * @default null
   * @public
   */
  'child-forms': null,

  /**
   * Options to be passed to the validation if using validators
   * @property validation-options
   * @type Object
   * @default {}
   * @public
   */
  'validation-options': {},

 /**
  * Allows multiple submit calls to be queued
  * @property allow-submit-enqueue
  * @type Boolean
  * @default false
  * @public
  */
  'allow-submit-queue': false,


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
    const model = this.get('model');
    return model.validate ? model.validate(validationOptions || this.get('validation-options')) : true;
  },

  /**
   * Clears the validations on the model
   * @method clearValidations
   * @public
   */
  clearValidations() {
    const model = this.get('model');
    return model.validate && model.validate({only: []});
  },

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
  },

  /**
   * Called when will submit returned false
   * @method didNotSubmit
   * @param {Object} [model]
   * @public
   */
  didNotSubmit() {
  },

  /**
   * Called when the submit action is called
   * @method onSubmit
   * @param {Object} model
   * @return {Promise.<Object>}
   * @public
   */
  onSubmit(model) {
    return model.save ? model.save() : Promise.resolve(model);
  },

  /**
   * Used to inform parent forms that either this form, or one of its children submitted
   * @method notifyChildFailedSubmit
   * @param {FormFor} originator
   * @public
   */
  notifyChildDidSubmit(originator) {
    const parentForm = this.get('parent-form');

    if (this !== originator) {
      this.childDidSubmit(originator);
    }

    if(parentForm) {
      parentForm.notifyChildDidSubmit();
    }
  },

  /**
   * Used to inform parent forms that either this form, or one of its children failed
   * submission
   * @method notifyChildFailedSubmit
   * @param {FormFor} originator
   * @public
   */
  notifyChildFailedSubmit(originator) {
    const parentForm = this.get('parent-form');

    if (this !== originator) {
      this.childFailedSubmit(originator);
    }

    if(parentForm) {
      parentForm.notifyChildFailedSubmit();
    }
  },

  /**
   * Called when a child of this form's onSubmit is fulfilled
   * @method didSubmit
   * @param {Object} model
   * @public
   */
  childDidSubmit(/*model*/) {},

  /**
   * Called when a child of this form's onSubmit is reject
   * @method didSubmit
   * @param {Object} model
   * @public
   */
  childFailedSubmit(/*model*/) {
  },

  /**
   * Called when the onSubmit is fulfilled
   * @method didSubmit
   * @param {Object} model
   * @public
   */
  didSubmit(/*model*/) {
  },

  /**
   * Called when the onSubmit is rejected
   * @method failedSubmit
   * @param {Object} reason
   * @public
   */
  failedSubmit(/*reason*/) {
  },

  /**
   * Action that actual does the submitting
   * @method doSubmit
   * @public
   */
  doSubmit() {
    const lastDoSubmit = this.get('lastDoSubmit');
    const allowSubmitQueue = this.get('allow-submit-queue');

    const model = this.get('model');
    const isSaving = get(model, 'isSaving');

    // Guard if the model is saving
    if (!isSaving && this.willSubmit(model) || allowSubmitQueue) {
      this._markSubmitting();

      const onSubmit = allowSubmitQueue && lastDoSubmit ? lastDoSubmit.then(() => this.onSubmit(model)) : this.onSubmit(model);

      const doSubmit = onSubmit
        .then(() => {
          if(this.get('isRootForm')) {
            return this.submitChildForms(this.get('child-forms'));
          }
        })
        .then(() => {
          this.notifySuccess(this.get('successful-submit-message'));
          this.didSubmit();
          this.notifyChildDidSubmit(false);
          this._markClean();
          this._runFieldDidSubmit();
          this.set('_hasFailedToSubmit', false);
          this.notifyChildDidSubmit(this);
        })
        .catch(_ => {
          this.notifyError(this.get('failed-submit-message'));
          this.failedSubmit(_);
          this.notifyChildFailedSubmit(this);
          return Promise.reject(_);
        })
        .finally(() => {
          this._unmarkSubmitting();
        });

        this.set('lastDoSubmit', doSubmit);

        return doSubmit;
    } else {
      this.set('_hasFailedToSubmit', true);
      this.didNotSubmit(model);
      this.notifyError(this.get('did-not-submit-message'));

      return Promise.resolve(true);
    }
  },


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

    if(!childForms.length) {
      return parentPromise;
    }

    const dirtyChildren = childForms.filter(_ => _.get('isModelDirty') || _.get('model.isDeleted') || _.get('model.isNew'));

    const newPromise = parentPromise.then(() =>
      Promise.all(dirtyChildren.map(_ => _.doSubmit()))
    );

    const nextDepth = Promise.all(
      childForms.map(_ => this.submitChildForms(_.get('child-forms'), newPromise))
    );

    return nextDepth;
  },

  /**
   * Called before the form resets
   * @method willReset
   * @param {Object} model
   * @return boolean
   * @public
   */
  willReset(/*model*/) {
    return true;
  },

  /**
   * Called when will reset returned false
   * @method didNotReset
   * @param {Object} model
   * @public
   */
  didNotReset(/*model*/) {
  },

  /**
   * Called when the reset action is called
   * @method onReset
   * @param {Object} [model]
   * @return {Promise.<Object>}
   * @public
   */
  onReset(model) {
    return Promise.resolve(model);
  },

  /**
   * Called when the onReset is fulfilled
   * @method didReset
   * @param {Object} model
   * @public
   */
  didReset(/*model*/) {
  },

  /**
   * Called when the onReset is rejected
   * @method failedReset
   * @param {Object} reason
   * @public
   */
  failedReset(/*reason*/) {
  },

  /**
   * Called when values are updated in the form. Useful for knowing when a field has
   * has changed without having to reach into individual fields or controls.
   * @method updateValues
   * @param {Object} keyValues
   * @public
   */
  onUpdateValues(/*keyValues*/){
  },

  /**
   * Called when the form is marked dirty
   * @method onMarkedDirty
   * @public
   */
  onMarkedDirty() {},

  /**
   * Called when the form is marked clean
   * @method onMarkedClean
   * @public
   */
  onMarkedClean() {},

  /**
   * Action that actual does the resetting
   * @method doReset
   * @public
   */
  doReset() {
    const model = this.get('model');

    if (this.willReset(model)) {

      this.set('isResetting', true);

      this.onReset()
        .then(() => {
          this.notifySuccess(this.get('successful-reset-message'));
          this.didReset();
          this._runFieldDidReset();
          this._markClean();
        })
        .catch(_ => {
          this.notifyError(this.get('failed-reset-message'));
          this.failedReset(_);
        })
        .finally(() => this.set('isResetting', false));
    } else {
      this.didNotReset(model);
      this.notifyError(this.get('did-not-reset-message'));
    }
  },


  /**
   * Called when the onDestroy is fulfilled
   * @method didDestroy
   * @public
   */
  didDestroy() {
  },


  /**
   * Called when the onDestroy is fulfilled
   * @method failedDestroy
   * @param {Object} reason
   * @public
   */
  failedDestroy(/* reason */) {
  },

  /**
   * Called to confirm the destruction of the model
   * @method confirmDestroy
   * @param {Object} model
   * @public
   */
  confirmDestroy(model) {
    this.set('isDestroyingRecord', true);
    this.get('formFor')
      .confirmDestroy(model, this.get('confirm-destroy-message'))
      .then(() => {
        this.notifySuccess(this.get('successful-destroy-message'));
        this.didDestroy();
      })
      .catch((_) => {
        this.notifyError(this.get('failed-destroy-message'));
        this.failedDestroy(_);
      })
      .finally(() => !this.get('isDestroyed') && this.set('isDestroyingRecord', false));
  },

  notifySuccess(message) {
    if (message && this.get('notify-of-success')) {
      this.get('formFor').notifySuccess(message);
    }
  },

  notifyError(message) {
    if (message && this.get('notify-of-error')) {
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
  updateValue(key, value) {
    // better code reuse this way
    return this.updateValues({[key]: value});
  },

  /**
   * Updates a collection of values on the model
   * @method updateValues
   * @param {Object} keyValues
   * @public
   */
  updateValues(keyValues) {
    this._checkClean();

    const model = this.get('model');

    if (model.setProperties) {
      model.setProperties(keyValues);
    } else {
      setProperties(model, keyValues);
    }

    if (this.get('_hasFailedToSubmit')) {
      Ember.run.next(() => this.runValidations());
    }

    this.onUpdateValues(keyValues);

    return this.get('auto-submit') ? this.doSubmit() : Promise.resolve(true);
  },

  _checkClean() {
    Ember.run.next(() => {
      const fields = this.get('fields') || [];
      const childForms = this.get('child-forms') || [];
      const dirtyChildModels = this.get('dirty-child-models') || [];

      const cleanFields = fields.every(_ => !_.get('isReallyDirty'));
      const cleanForms = childForms.every(_ => !_.get('isModelDirty'));
      const noDirtyChildModels = !dirtyChildModels.length;

      if (cleanFields && cleanForms && noDirtyChildModels) {
        this._markClean();
      } else {
        this._markDirty();
      }

      const parentForm = this.get('parentForm');
      if(parentForm) {
        parentForm._checkClean();
      }
    });
  },

  resetValues(keyValues) {
    const model = this.get('model');

    if (model.setProperties) {
      model.setProperties(keyValues);
    } else {
      setProperties(model, keyValues);
    }

    this._checkClean();
  },

  resetValue(key, value) {
    this.resetValues({[key]: value});
  },

  /**
   * Marks the form as dirty
   * @method _markDirty
   * @private
   */
  _markDirty() {
    if (!this.get('isDestroyed')) {
      this.set('isModelDirty', true);
      this.onMarkedDirty(this.get('model'));
    }
  },

  /**
   * Marks the form as clean
   * @method _markClean
   * @private
   */
  _markClean() {
    if (!this.get('isDestroyed')) {
      this.set('isModelDirty', false);
      this.onMarkedClean(this.get('model'));
    }
  },

  /**
   * Marks the form as submitting
   * @method _markSubmitting
   * @private
   */
  _markSubmitting() {
    this.set('_isSubmitting', true);
    this._recomputeIsSubmitting();
  },

  /**
   * Unmarks the form as submitting
   * @method _unmarkSubmitting
   * @private
   */
  _unmarkSubmitting() {
    this.set('_isSubmitting', false);
    this._recomputeIsSubmitting();
  },

  /**
   * Manual property change notification is required because if
   * we watch the children's forms child form registration will cause
   * isSubmitting to be set twice during a single render.
   * @method _recomputeIsSubmitting
   * @private
   */
  _recomputeIsSubmitting() {
    this.notifyPropertyChange('isSubmitting');

    const parentForm = this.get('parent-form');
    if(parentForm) {
      parentForm._recomputeIsSubmitting();
    }
  },

  /**
   * Runs the callback for did submit on all of the fields
   * @method _runFieldDidSubmit
   * @private
   */
  _runFieldDidSubmit() {
    (this.get('fields') || []).forEach(_ => _.formDidSubmit());
  },

  /**
   * Runs the callback for did reset on all of the fields
   * @method _runFieldDidReset
   * @private
   */
  _runFieldDidReset() {
    (this.get('fields') || []).forEach(_ => _.formDidReset());
  },


  /**
   * Registers a field with the form
   * @method registerField
   * @param {FieldFor} field
   * @public
   */
  registerField(field) {
    const fields = this.get('fields') || [];
    fields.push(field);
    this.set('fields', fields);
  },

  /**
   * Unregisters a field with the form
   * @method unregisterField
   * @param {FieldFor} field
   * @public
   */
  unregisterField(field) {
    const fields = this.get('fields') || [];
    fields.removeObject(field);
    this.set('fields', fields);
  },

  /**
   * Registers a child form with it's parent
   * @method registerChildForm
   * @param {FormFor} form
   * @public
   */
  registerChildForm(form) {
    const childForms = this.get('child-forms') || [];
    childForms.push(form);
    this.set('child-forms', childForms);
  },

  /**
   * Unregisters a child form with it's parent
   * @method unregisterChildForm
   * @param {FormFor} form
   * @public
   */
  unregisterChildForm(form) {
    const childForms = this.get('child-forms') || [];
    childForms.removeObject(form);
    this.set('child-forms', childForms);
  },

  init() {
    if (this.tagName === '') {
      this.classNameBindings = [];
    }

    this._super();

    if (this.get('prevents-navigation')) {
      this.handleWilltransition = (transition) => {

        const isDirty = this.get('useEmberDataDirtyTracking') && this.get('model.hasDirtyAttributes') || this.get('isModelDirty');

        if (isDirty && !confirm('You have unsaved changes, are you sure you want to leave?')) {
          transition.abort();
        }
      };

      // in test environments that are not acceptance, we won't have real router
      let router = this.get('router');
      if (router && router.on) {
        this.get('router')
          .on('willTransition', this, this.handleWilltransition);
      }

      // prevent browser reloads
      window.onbeforeunload = () => {
        const isDirty = this.get('useEmberDataDirtyTracking') && this.get('model.hasDirtyAttributes') || this.get('isModelDirty');

        if (isDirty) {
          return 'You have unsaved changes, are you sure you want to leave?';
        }
      };
    }

    const parentForm = this.get('parent-form');
    if(parentForm) {
      parentForm.registerChildForm(this);
    }
  },

  willDestroyElement() {
    window.onbeforeunload = null;

    // in test environments that are not acceptance, we won't have real router
    let router = this.get('router');
    if (router && router.off && this.handleWilltransition) {
      router.off('willTransition', this, this.handleWilltransition);
    }

    const parentForm = this.get('parent-form');
    if(parentForm) {
      parentForm.unregisterChildForm(this);
    }
  },

  actions: {

    submit() {
      this.doSubmit();
    },

    reset() {
      this.doReset();
    },

    updateValue(key, value) {
      return this.updateValue(key, value);
    },

    updateValues(keyValues) {
      return this.updateValues(keyValues);
    }

  }


});

FormFor.reopenClass({
  positionalParams: ['model']
});

export default FormFor;
