import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { arg } from 'ember-arg-types';
import { object, string} from 'prop-types';
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

  constructor() {
    super(...arguments);

    if (this.field) {
      next(() => this.field.hideDefaultLabel = true)
    }
  }

}
