import Ember from 'ember';
import layout from '../templates/components/label-for';

export default Ember.Component.extend({
  layout,

  // remove tags, so we don't interfere with styles that use direct inheritance
  tagName: '',

  /**
   * Label to be displayed
   *
   * @property label
   * @type String
   * @default null
   * @public
   */
  label: '',

  /**
   * Id for the control that this label is tied to
   * @property controlId
   * @type String
   * @default null
   * @public
   */
  controlId: ''
});
