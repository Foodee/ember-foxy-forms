import Ember from 'ember';
import layout from '../templates/components/commit-buttons';

const {
  computed,
  get
} = Ember;

export default Ember.Component.extend({
  layout,

  // remove tags, so we don't interfere with styles that use direct inheritance
  tagName: '',

  config: computed(function () {
    return get(Ember.getOwner(this).resolveRegistration('config:environment'), 'APP.ember-form-for');
  }),

  /**
   * Errors to be rendered by this component
   * @property visible
   * @type boolean
   * @default false
   * @public
   */
  visible: false,

  /**
   * Override function for custom behavior on commit
   * @method commit
   * @public
   */
  commit(){
  },

  /**
   * Override function for custom behavior on cancel
   * @method commit
   * @public
   */
  cancel(){
  }
});
