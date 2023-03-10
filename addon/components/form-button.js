import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { arg } from 'ember-arg-types';
import { string, bool } from 'prop-types';
import { action } from '@ember/object';

export default class FormButtonComponent extends Component {
  /**
   * The type of button (ie, submit)
   * @param {String} buttonType
   * @public
   */
  @arg(string)
  buttonType = 'button';

  /**
   * Disable named grid areas at the prop level by default
   * @param {String} useGridTemplate
   * @public
   */
  @arg(bool)
  get useGridTemplate() {
    return this.args?.form?.useGridTemplate ?? false;
  }

  /**
   * The name of the button's grid area
   * @property gridArea
   * @type String
   * @default false
   * @public
   */
  get gridArea() {
    return this.useGridTemplate ? this._gridAreaName : 'auto';
  }

  get _gridAreaName() {
    const prefix = this.args.form.gridTemplatePrefix ?? '';
    return `${prefix}${this.buttonType}`;
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
