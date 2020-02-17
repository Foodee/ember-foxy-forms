import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class FormControlsInputControlComponent extends Component {
  @action
  handleClick(event) {
    if (this.args.onClick) {
      return this.args.onClick(event.target.value);
    }
  }

  @action
  handleFocus(event) {
    if (this.args.onFocus) {
      return this.args.onFocus(event.target.value);
    }
  }

  @action
  handleBlur(event) {
    if (this.args.onBlur) {
      return this.args.onBlur(event.target.value);
    }
  }

  @action
  handleChange(event) {
    if (this.args.onChange) {
      return this.args.onChange(event.target.value);
    }
  }
}
