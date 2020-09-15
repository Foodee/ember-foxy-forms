import Component from '@glimmer/component';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { arg } from 'ember-arg-types';
import { bool } from 'prop-types';

export default class FormControlsFfCheckboxComponent extends Component {
  @arg value = false;
  @arg(bool) isInverted = false;

  get id() {
    return guidFor(this);
  }

  get checked() {
    return this.isInverted ? !this.value : this.value;
  }

  @action
  handleChange() {
    this.args.onChange(!this.args.value);
  }
}
