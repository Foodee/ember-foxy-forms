import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
export default class FieldsController extends Controller {
  object = {
    @tracked
    number: 1,
  };
}
