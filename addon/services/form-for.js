import Ember from 'ember';


const {
  RSVP: {Promise}
} = Ember;

export default Ember.Service.extend({

  /**
   * Called by form's delete button to confirm the destruction of
   * a record override for custom behavior in your project (ie pop up a modal)
   * @method confirmDestroy
   * @param {Object} model
   * @public
   */
  confirmDestroy(model, message = 'Are you sure you want to destroy this?'){
    let ret = Promise.resolve(model);
    if (confirm(message)) {
      if (model.destroyRecord) {
        ret = model.destroyRecord();
      }
    }

    return ret;
  },

  /**
   * Called on form success override for custom behavior
   * @method notifyError
   * @param {String} message
   * @public
   */
  notifySuccess(message){
    alert('Success: ' + message);
  },


  /**
   * Called on form failures
   * @method notifyError
   * @param {String} message
   * @public
   */
  notifyError(message){
    alert('Error: ' + message);
  },


  /**
   * In case some people have overridden these in their application space
   * lets null them to prevent leaks
   */
  willDestroy(){
    this.confirmDestroy = null;
    this.notifySuccess = null;
    this.notifyError = null;
  }

});
