import Ember from 'ember';
import layout from '../templates/components/commit-buttons';

const {
  Component,
  computed,
  getOwner,
} = Ember;

export default Component.extend({
  layout,

  // remove tags, so we don't interfere with styles that use direct inheritance
  tagName: '',

  config: computed(function () {
    return Object.assign({}, getOwner(this).resolveRegistration('config:environment').APP['ember-foxy-forms']);
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
