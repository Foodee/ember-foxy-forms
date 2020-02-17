import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class FormControlsSelectControlComponent extends Component {
  @action
  handleChange(event) {
    if (this.args.onChange) {
      return this.args.onChange(event.target.value);
    }
  }
}
