import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { arg } from 'ember-arg-types';

export default class FormButtonComponent extends Component {
  @arg
  buttonType = 'button';

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
