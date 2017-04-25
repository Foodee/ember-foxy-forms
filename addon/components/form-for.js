import Ember from 'ember';
import layout from '../templates/components/form-for';
import config from '../config/environment';

const {
  inject: { service }
} = Ember;

const FormFor = Ember.Component.extend({

  layout,

  config: config,

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


