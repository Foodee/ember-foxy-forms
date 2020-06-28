import Component from '@glimmer/component';
import { action } from '@ember/object';
import { arg } from 'ember-arg-types';
import { string } from 'prop-types';

export default class FormControlsFfInputComponent extends Component {
  @arg(string)
  inputType;

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
