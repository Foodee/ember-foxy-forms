import FormControlsFfSelectComponent from './ff-select';

export default class FormControlsFfRadioComponent extends FormControlsFfSelectComponent {
  get valuesWithNone() {
    return this.allowNone ? [null, ...this.values.toArray()] : this.values;
  }
}
