import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
export default class FieldsController extends Controller {
  object = {
    @tracked
    number: 1,
  };
  valuesForSelectObjectWithDisabledOption = [
    { id: '1', label: 'one' },
    { id: '2', label: 'two', disabled: true },
    { id: '3', label: 'three' },
  ];
}
