import Component from '@glimmer/component';
import { action } from '@ember/object';
import { arg, string, bool } from 'ember-arg-types';

export default class FormControlsFfInputComponent extends Component {
  @arg(bool)
  live = false;

  @arg(bool)
  readonly = false;

  @arg(string)
  inputType = 'text';

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
  handleKeyUp(event) {
    if (this.readonly) {
      event.preventDefault();
    }

    if (this.live) {
      this.handleChange(event);
    }
  }

  @action
  handleKeyDown(event) {
    if (this.readonly) {
      event.preventDefault();
    }
  }

  @action
  handleCut(event) {
    if (this.readonly) {
      event.preventDefault();
    }
  }

  @action
  handleChange(event) {
    if (this.args.onChange) {
      return this.args.onChange(event.target.value);
    }
  }
}
