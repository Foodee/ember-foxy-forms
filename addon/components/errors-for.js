import Ember from 'ember';
import layout from '../templates/components/errors-for';


const {
  computed,
  get,
} = Ember;

/**
 * This class conditionally renders an array of errors
 * @class ErrorsFor
 */
export default Ember.Component.extend({
  layout,

  config: computed(function () {
    return get(Ember.getOwner(this).resolveRegistration('config:environment'), 'APP.ember-foxy-forms');
  }),

  // remove tags, so we don't interfere with styles that use direct inheritance
  tagName: '',

  /**
   * Errors to be rendered by this component
   * @property label
   * @type String
   * @default null
   * @public
   */
  errors: null
});
