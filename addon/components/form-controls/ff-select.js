import { action, get } from '@ember/object';
import FormControlsAbstractSelectComponent from './abstract-select';

export default class FormControlsFfSelectComponent extends FormControlsAbstractSelectComponent {
  get selected() {
    return this.values.find((_) => this._compare(_, this.value));
  }

  @action
  handleChange(event) {
    let value = event.target.value;

    if (!this.isPrimitive) {
      value = this.values.find((_) => get(_, this.idKey) === value);
    }

    if (this.args.onChange) {
      return this.args.onChange(value);
    }
  }
}
