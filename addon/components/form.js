import FormForComponent from './form-for';
import { alias } from '@ember/object/computed';

export default class FormComponent extends FormForComponent {
  @alias('args.for')
  model;
}
