import Service from '@ember/service';
import { getOwner } from '@ember/application';
import { Promise } from 'rsvp';

export default class FormForService extends Service {
  constructor() {
    super(...arguments);

    this.testingClassPrefix = this.config.testingClassPrefix;
    this.fieldClasses = this.config.fieldClasses;
    this.formClasses = this.config.formClasses;
    this.fieldForControlCalloutClasses = this.config.fieldForControlCalloutClasses;
    this.fieldForControlCalloutPosition = this.config.fieldForControlCalloutPosition;
    this.buttonClasses = this.config.buttonClasses;
    this.submitButtonClasses = this.config.submitButtonClasses;
    this.resetButtonClasses = this.config.resetButtonClasses;
    this.customCommitCancelComponent = this.config.customCommitCancelComponent;
    this.customErrorComponent = this.config.customErrorComponent;
    this.controlPrefix = this.config.controlPrefix;
    this.controlsFolder = this.config.controlsFolder;
  }

  get config() {
    return Object.assign(
      {},
      getOwner(this).resolveRegistration('config:environment').APP['ember-foxy-forms']
    );
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
