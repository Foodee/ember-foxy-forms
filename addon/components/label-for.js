import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { arg } from 'ember-arg-types';
import { object, string, boolean } from 'prop-types';
import { next } from '@ember/runloop';

export default class LabelFor extends Component {
  @service formFor;

  /**
   * Custom Label Component for rendering all labels on this form
   * @property customLabelComponent
   * @type String
   * @default null
   * @public
   */
  @arg(string)
  customLabelComponent;

  @arg(object)
  field;

  @arg(object)
  form;

  @arg(string)
  requiredText;

  @arg(boolean)
  required = false;

  @arg(boolean)
  get showRequiredIndicator() {
    return this.required && this.form?.showRequiredIndicator;
  }

  constructor() {
    super(...arguments);

    if (this.field) {
      next(() => (this.field.hideDefaultLabel = true));
    }
  }
}
