import Component from '@ember/component';
import { action, get } from '@ember/object';
import { getOwner } from '@ember/application';
import { tagName } from '@ember-decorators/component';

@tagName('')
export default class FormButtonComponent extends Component {
  icon = null;
  bubbles = true;

  get config() {
    return Object.assign(
      {},
      getOwner(this).resolveRegistration('config:environment').APP['ember-foxy-forms']
    );
  }

  onClick() {}

  @action
  handleClick() {
    if (!get(this, 'isActing')) {
      this.onClick();
    }
  }
}
