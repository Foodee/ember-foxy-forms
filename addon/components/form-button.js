import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class FormButtonComponent extends Component {
  isActing = false;
  @action
  handleClick() {
    if (!this.isActing && this.args.onClick) {
      const ret = this.args.onClick();

      if (ret.finally) {
        this.isActing = true;
        ret.finally(() => (this.isActing = false));
      }
      return ret;
    }
  }
}
