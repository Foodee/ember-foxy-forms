import Service from '@ember/service';
import { getOwner } from '@ember/application';
import { Promise } from 'rsvp';
import { A } from '@ember/array';
import { inject as service } from '@ember/service';

export default class FormForService extends Service {
  @service router;

  forms = A();

  constructor() {
    super(...arguments);

    this.testingClassPrefix = this.config.testingClassPrefix;
    this.bemClassPrefix = this.config.bemClassPrefix;
    this.useBemClass = this.config.useBemClass;
    this.submittingClasses = this.config.submittingClasses;
    this.fieldClasses = this.config.fieldClasses;
    this.formClasses = this.config.formClasses;
    this.fieldForControlCalloutClasses = this.config.fieldForControlCalloutClasses;
    this.fieldForControlCalloutPosition = this.config.fieldForControlCalloutPosition;
    this.buttonClasses = this.config.buttonClasses;
    this.buttonActingClass = this.config.buttonActingClass;
    this.submitButtonClasses = this.config.submitButtonClasses;
    this.resetButtonClasses = this.config.resetButtonClasses;
    this.destroyButtonClasses = this.config.destroyButtonClasses;
    this.customCommitCancelComponent = this.config.customCommitCancelComponent;
    this.customErrorComponent = this.config.customErrorComponent;
    this.customButtonComponent = this.config.customButtonComponent;
    this.customLabelComponent = this.config.customLabelComponent;
    this.customInfoTextComponent = this.config.customInfoTextComponent;
    this.preventsNavigationByDefault = this.config.preventsNavigationByDefault;
    this.showRequiredIndicator = this.config.showRequiredIndicator;
    this.requiredText = this.config.requiredText;

    this.router.on('routeWillChange', (transition) => {
      if (
        !transition.isAborted &&
        this.shouldPreventNavigation &&
        !confirm('You have unsaved changes, are you sure you want to leave?')
      ) {
        transition.abort();
      }
    });

    // prevent browser reloads
    window.onbeforeunload = () => {
      if (this.shouldPreventNavigation) {
        return 'You have unsaved changes, are you sure you want to leave?';
      }
    };
  }

  get config() {
    return Object.assign(
      {},
      getOwner(this).resolveRegistration('config:environment').APP['ember-foxy-forms']
    );
  }

  register(form) {
    this.forms.pushObject(form);
  }

  deregister(form) {
    this.forms.removeObject(form);
  }

  get shouldPreventNavigation() {
    return this.forms.any((form) => form.isDirty && form.preventsNavigation);
  }

  /**
   * Called by form's delete button to confirm the destruction of
   * a record override for custom behavior in your project (ie pop up a modal)
   * @method confirmDestroy
   * @param {Object} model
   * @public
   */
  confirmDestroy(model, message = 'Are you sure you want to destroy this?') {
    let ret = Promise.resolve(model);
    if (confirm(message)) {
      if (model.destroyRecord) {
        ret = model.destroyRecord();
      }
    }

    return ret;
  }

  /**
   * Called on form success override for custom behavior
   * @method notifyError
   * @param {String} message
   * @public
   */
  notifySuccess(message) {
    alert('Success: ' + message);
  }

  /**
   * Called on form failures
   * @method notifyError
   * @param {String} message
   * @public
   */
  notifyError(message) {
    alert('Error: ' + message);
  }

  /**
   * In case some people have overridden these in their application space
   * lets null them to prevent leaks
   */
  willDestroy() {
    this.confirmDestroy = null;
    this.notifySuccess = null;
    this.notifyError = null;
  }
}
