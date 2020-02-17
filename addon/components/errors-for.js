import Component from '@ember/component';
import { getOwner } from '@ember/application';
import { tagName } from '@ember-decorators/component';

/**
 * This class conditionally renders an array of errors
 * @class ErrorsFor
 */
@tagName('') // remove tags, so we don't interfere with styles that use direct inheritance
export default class ErrorsForComponent extends Component {
  /**
   * Errors to be rendered by this component
   * @property label
   * @type String
   * @default null
   * @public
   */
  errors = null;

  get config() {
    return Object.assign(
      {},
      getOwner(this).resolveRegistration('config:environment').APP['ember-foxy-forms']
    );
  }
}
