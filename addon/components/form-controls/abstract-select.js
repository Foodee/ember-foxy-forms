import Component from '@glimmer/component';
import { arg } from 'ember-arg-types';
import { string } from 'prop-types';
import { typeOf } from '@ember/utils';
import { get } from '@ember/object';
import { action } from '@ember/object';

export default class FormControlsAbstractSelectComponent extends Component {
  @arg(string)
  labelKey = 'label';

  @arg(string)
  idKey = 'id';

  @arg
  values = [];

  get isPrimitive() {
    return this.values.every((_) => ['string', 'number'].includes(typeOf(_)));
  }

  @action
  idFor(item) {
    return this.isPrimitive ? item : get(item, this.idKey);
  }

  @action
  labelFor(item) {
    return this.isPrimitive ? item : get(item, this.labelKey);
  }

  _compare(a, b) {
    return this.isPrimitive ? a === b : a && b && get(a, this.idKey) === get(b, this.idKey);
  }
}
