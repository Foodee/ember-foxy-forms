import Component from '@ember/component';
import { getOwner } from '@ember/application';
import { tagName } from '@ember-decorators/component';

@tagName('') // remove tags, so we don't interfere with styles that use direct inheritance
export default class CommitButtonsComponent extends Component {
  /**
   * Errors to be rendered by this component
   * @property visible
   * @type boolean
   * @default false
   * @public
   */
  visible = false;

  get config() {
    return Object.assign(
      {},
      getOwner(this).resolveRegistration('config:environment').APP['ember-foxy-forms']
    );
  }
}
