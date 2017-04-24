import Ember from 'ember';
import layout from '../templates/components/form-for';

const FormFor = Ember.Component.extend({

  layout,

  tagName: '',

  model: null,

  autoCommit: true,

  updateValue(key, value){
    this.set(`form.model.${key}`, value);
  }

});

FormFor.reopenClass({
  positionalParams: ['model']
});

export default FormFor;


