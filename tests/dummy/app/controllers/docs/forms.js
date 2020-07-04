import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class FormsController extends Controller {
  object = {
    @tracked atttribute: '',
  };

  @action
  async handleSubmit() {
    return true;
  }
}
