import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class FormControlsFfMultipleInputComponent extends Component {
  get _inputs() {
    return Object.keys(this.args.value || []).map((key, index) => ({
      key: key,
      id: index,
    }));
  }

  @action
  handleValueChange(key, event) {
    if (this.args.onChange) {
      this.args.onChange(Object.assign({}, this.args.value, { [key]: event.target.value }));
    }
  }
}
