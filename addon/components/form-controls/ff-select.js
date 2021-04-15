import { action } from '@ember/object';
import { arg } from 'ember-arg-types';
import { string } from 'prop-types';

import FormControlsAbstractSelectComponent from './abstract-select';

export default class FormControlsFfSelectComponent extends FormControlsAbstractSelectComponent {
  @arg(string) placeholder = 'Please select an option...';

  get selected() {
    return this.values.find((_) => this._compare(_, this.value));
  }

  @action
  handleChange(event) {
    let value = event.target.value;

    value = this.values.find((_) => this._compare(_, value));

    if (this.args.onChange) {
      return this.args.onChange(this.storeValue(value));
    }
  }
}
