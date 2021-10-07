import FormControlsFfSelectComponent from './ff-select';
import { action } from '@ember/object';

export default class FormControlsFfRadioComponent extends FormControlsFfSelectComponent {

  @action
  radioElementIdFor(item) {
    return `${this.for}-${this.idFor(item)}`
  }

}
