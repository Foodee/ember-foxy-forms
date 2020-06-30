import FormControlsFfInputComponent from './ff-input';
import { arg } from 'ember-arg-types';
import { string } from 'prop-types';
import { action } from '@ember/object';

export default class FormControlsFfCurrencyComponent extends FormControlsFfInputComponent {
  @arg(string)
  prefix = '$ '

  @action
  handleChange(value) {

    if (this.readonly && value.preventDefault) {
      value.preventDefault();
      return false;
    }

    if (this.args.onChange) {
      const value = parseFloat(value);
      if (value) {
        return this.args.onChange(value);
      }
    }
  }
}
