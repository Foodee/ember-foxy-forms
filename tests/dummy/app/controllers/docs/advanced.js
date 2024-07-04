import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

class User {
  @tracked name = 'user-1234';
}

class Avatar {
  @tracked name = 'default';
}

export default class AdvancedController extends Controller {
  @tracked user = new User();
  @tracked avatar = new Avatar();

  @action
  async handleSubmit() {
    alert(`Creating new user with username ${this.user.name}... user created!`);
  }

  @action
  async handleChildSubmit() {
    alert(`Updating avatar description to ${this.user.name}-${this.avatar.name}-avatar.jpeg... avatar description updated!`);
  }
}
