import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { arg } from 'ember-arg-types';
import { string, bool } from 'prop-types';

export default class FormButtonComponent extends Component {
  /**
   * The type of button (ie, submit)
   * @param {String} buttonType
   * @public
   */
  @arg(string)
  buttonType = 'button';

  /**
   * Is the gridAreaName disabed
   * @param {Boolean} gridAreaDisabled
   * @public
   */
  @arg(bool)
  gridAreaDisabled = false;

  /**
   * The name of the field's grid area
   * @property gridArea
   * @type String
   * @default false
   * @public
   */
  // NOTE: grid area names are plain strings so values like 'unset' or 'undefined' will be
  // interpolated. To get around this, we pass a string with no value.
  get gridArea() {
    return this.args.gridAreaDisabled ? '' : this.buttonType;
  }

  @tracked
  isActing = false;

  @action
  handleClick() {
    if (!this.isActing && this.args.onClick) {
      const ret = this.args.onClick();

      if (ret && ret.finally) {
        this.isActing = true;
        ret.finally(() => (this.isActing = false));
      }
      return ret;
    }
  }
}
