import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class FieldsController extends Controller {
  object = {
    @tracked
    attribute: '',
    @tracked
    attribute1: '',
    @tracked
    attribute2: '',
    @tracked
    number: 1,
  };

  @action
  handleDidCommitValue(value) {
    alert(`Committed Value: ${value}`);
  }

  @action
  handleDidCommitValues(value) {
    alert(`Committed Values: ${JSON.stringify(value)}`);
  }
}
