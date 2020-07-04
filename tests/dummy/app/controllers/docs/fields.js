import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class FieldsController extends Controller {
  object = {
    @tracked singleValue: '',
    @tracked labeledAttribute: '',
    @tracked composite1: '',
    @tracked composite2: '',
    @tracked number: 1,
    @tracked select: 1,
    @tracked placeholder: null,
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
