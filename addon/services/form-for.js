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
   * Computes the dirty key for a given guid
   * @method _dirtyKeyFor
   * @param guid
   * @returns {string}
   * @private
   */
  _dirtyKeyFor(guid) {
    return `${guid}IsDirty`;
  },


  /**
   * Check if a guid has been marked dirty
   * @method isGuidDirty
   * @param {String} guid
   * @public
   */
  isGuidDirty(guid){
    return this.get(this._dirtyKeyFor(guid));
  },

  /**
   * Used to mark forms with a shared model dirty
   * @method markDirty
   * @param {String} guid
   * @public
   */
  markDirty(guid){
    this.set(this._dirtyKeyFor(guid), true);
  },

  /**
   * Used to mark forms with a shared model dirty
   * @method markDirty
   * @param {String} guid
   * @public
   */
  markClean(guid){
    this.set(this._dirtyKeyFor(guid), false);
  },

  /**
   * Register a form with the form for service
   * @method registerGuid
   * @param {String} guid
   * @public
   */
  registerGuid(guid){
    this.incrementProperty(`formFor${guid}`)
  },

  /**
   * Unregister a form with the form for service, if its the last form for that
   * guid, destroy all memory of it
   * @method registerGuid
   * @param {String} guid
   * @public
   */
  unregisterGuid(guid){
    let formCounterKey = `formFor${guid}`;
    this.decrementProperty(formCounterKey);

    if (this.get(formCounterKey) === 0) {
      delete this[formCounterKey];
      delete this[this._dirtyKeyFor(guid)];
    }

  }

});
