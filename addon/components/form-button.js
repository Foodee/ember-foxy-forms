import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class FormButtonComponent extends Component {
  @action
  handleClick() {
    if (!this.args.isActing && this.args.onClick) {
      return this.args.onClick();
    }
  }
}
