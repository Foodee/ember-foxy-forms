import FormControlsAbstractSelectComponent from './abstract-select';
import { action } from '@ember/object';
import { arg } from 'ember-arg-types';
import { string, bool, number } from 'prop-types';
import { get } from '@ember/object';
import { A } from '@ember/array';
import { guidFor } from '@ember/object/internals';
import { dasherize } from '@ember/string';

export default class FormControlsFfCheckboxSelectComponent extends FormControlsAbstractSelectComponent {
  @arg(string)
  for = 'id';

  @arg(bool)
  isInverted = false;

  @arg(number)
  selectionMax;

  @arg
  value = [];

  @arg(bool)
  showClearAll = false;

  get _showClearAll() {
    return this.showClearAll && this.value.length > 0;
  }

  @action
  idFor(item) {
    return dasherize(
      `${this.for}-${this.isPrimitive ? item : get(item, this.idKey)}-${guidFor(this)}`
    );
  }

  @action
  labelFor(item) {
    return this.isPrimitive ? item : get(item, this.labelKey);
  }

  @action
  handleChange(value) {
    const isSelected = this.isSelected(value);
    if (this.atMax && !isSelected) {
      return;
    }

    if (isSelected) {
      this.args.onChange(this.value.filter((_) => !this._compare(_, value)));
    } else {
      this.args.onChange(A(this.value).toArray().concat(value));
    }
  }

  @action
  isSelected(value) {
    const isSelected = !!this.value.find((_) => this._compare(_, value));
    return this.isInverted ? !isSelected : isSelected;
  }

  @action
  clearAll() {
    return this.args.onChange([]);
  }

  _compare(a, b) {
    return this.isPrimitive ? a === b : get(a, this.idKey) === get(b, this.idKey);
  }

  get atMax() {
    return this.selectionMax !== undefined && this.selectionMax === this.value.length;
  }
}
