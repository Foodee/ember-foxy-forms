import FormControlsFfInputComponent from './ff-input';
import { arg } from 'ember-arg-types';
import { bool } from 'prop-types';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class FormControlsFfTextareaComponent extends FormControlsFfInputComponent {
  @tracked length;

  @arg(bool) showMaxLength = false;

  @arg maxLength;

  constructor() {
    super(...arguments);

    this.length = this.args.value?.length ?? 0;
  }

  get _showMaxLength() {
    return this.showMaxLength && this.maxLength;
  }

  get isAtMaxLength() {
    return this.length === this.maxLength;
  }

  @action
  handleChange(event) {
    this.length = event.target.value.length;

    if (this.args.onChange) {
      return this.args.onChange(event.target.value);
    }
  }
}
