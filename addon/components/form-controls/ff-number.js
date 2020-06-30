import FormControlsFfInputComponent from './ff-input';
import { action } from '@ember/object';

export default class FormControlsFfNumberComponent extends FormControlsFfInputComponent {
  inputType = 'number';

  @action
  handleChange(value) {
    if (this.args.onChange) {
      return this.args.onChange(parseFloat(value));
    }
  }
}
