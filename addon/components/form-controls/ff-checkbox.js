import Component from '@glimmer/component';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';

export default class FormControlsFfCheckboxComponent extends Component {
  @action
  handleChange() {
    this.args.onChange(!this.args.value);
  }

  get id() {
    return guidFor(this);
  }
}
