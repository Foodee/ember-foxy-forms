import Component from '@glimmer/component';
import { arg } from 'ember-arg-types';
import { string, bool } from 'prop-types';
import { get } from '@ember/object';
import { action } from '@ember/object';

export default class FormControlsAbstractSelectComponent extends Component {
  @arg(string)
  labelKey = 'label';

  @arg(string)
  idKey = 'id';

  @arg
  values = [];

  @arg
  value;

  @arg(bool)
  storeAsPrimitive = false;

  get isPrimitive() {
    return this.values.every((_) => this._isPrimitive(_));
  }

  @action
  isSelected(item) {
    return this._compare(item, this.value);
  }

  @action
  idFor(item) {
    return this._isPrimitive(item) ? item : get(item, this.idKey);
  }

  @action
  labelFor(item) {
    return this._isPrimitive(item) ? item : get(item, this.labelKey);
  }

  coerceValue(value) {
    if (this._isPrimitive(value)) {
      return value;
    }

    return this.storeAsPrimitive ? get(value, this.idKey) : value;
  }

  _compare(a, b) {
    return this.coerceValue(a) === this.coerceValue(b);
  }

  /** Borrowed from https://github.com/jonschlinkert/is-primitive */
  _isPrimitive(val) {
    if (typeof val === 'object') {
      return val === null;
    }

    return typeof val !== 'function';
  }
}
