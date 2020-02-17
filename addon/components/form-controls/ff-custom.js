import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class FormControlsFfCustomComponent extends Component {
  @action
  increment() {
    this.args.onChange(this.args.value + 1);
  }

  @action
  decrement() {
    this.args.onChange(this.args.value - 1);
  }
}
