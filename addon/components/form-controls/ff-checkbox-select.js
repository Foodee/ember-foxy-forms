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
      `${this.for}-${this._isPrimitive(item) ? item : get(item, this.idKey)}-${guidFor(this)}`
    );
  }

  @action
  handleChange(value) {
    const isSelected = this.isSelected(value);
    if (this.atMax && !isSelected) {
      return;
    }

    if (this.isInverted) {
      if (isSelected) {
        this.add(value);
      } else {
        this.remove(value);
      }
    } else {
      if (isSelected) {
        this.remove(value);
      } else {
        this.add(value);
      }
    }
  }

  remove(value) {
    this.args.onChange(this.value.filter((_) => !this._compare(_, value)));
  }

  add(value) {
    this.args.onChange(A(this.value).toArray().concat(this.storeValue(value)));
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

  get atMax() {
    return this.selectionMax !== undefined && this.selectionMax === this.value.length;
  }
}
