import FormControlsAbstractSelectComponent from './abstract-select';
import { action } from '@ember/object';
import { arg } from 'ember-arg-types';
import { string, array } from 'prop-types';
import { get } from '@ember/object';

export default class FormControlsFfCheckboxSelectComponent extends FormControlsAbstractSelectComponent {
  @arg(string)
  for = 'id';

  @arg(array)
  value = [];

  @action
  idFor(item) {
    return `${this.for}-${this.isPrimitive ? item : get(item, this.idKey)}`;
  }

  @action
  labelFor(item) {
    return this.isPrimitive ? item : get(item, this.labelKey);
  }

  @action
  handleChange(value) {
    if (this.isSelected(value)) {
      this.args.onChange(this.value.filter((_) => !this._compare(_, value)));
    } else {
      this.args.onChange([value].concat(this.value));
    }
  }

  @action
  isSelected(value) {
    return this.value.some((_) => this._compare(_, value));
  }

  _compare(a, b) {
    return this.isPrimitive ? a === b : get(a, this.idKey) === get(b, this.idKey);
  }
}
