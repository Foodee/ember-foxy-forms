import Ember from 'ember';
import layout from '../templates/components/field-for';
import config from '../config/environment';

const {
  defineProperty,
  computed,
  assert
} = Ember;

const FieldFor = Ember.Component.extend({

  config: config,

  layout,

  tagName: '',

  model: null,

  key: '',

  label: null,

  fieldComponent: null,

  form: null,

  using: '-input',

  autoCommit: computed.oneWay('form.autoCommit'),

  _control: computed('using', 'value', function () {
    return `form-controls/${this.get('using')}-control`;
  }),

  dirty: computed('_value', 'value', function () {
    return this.get('_value') !== this.get('value');
  }),

  commitValue(_key, _value) {
  },

  handleChange(value) {
    this.set('_value', value);

    if (this.autoCommit) {
      this.commit();
    }
  },

  commit(){
    this.commitValue(this.get('key'), this.get('_value'));
  },

  cancel(){
    this.set('_value', this.get('value'));
  },

  init(){
    this._super(...arguments);

    const key = this.get('key');

    assert(!!key, 'The field for component must have a key in order to be used');

    defineProperty(this, 'errors', computed.oneWay(`form.model.errors.${key}`));
    defineProperty(this, 'value', computed.oneWay(`form.model.${key}`));

    defineProperty(this, '_value', computed('value', {
      get() {
        return this.get('value');
      },
      set(key, value) {
        return value;
      }
    }));
  }
});

FieldFor.reopenClass({
  positionalParams: ['key', 'control']
});

export default FieldFor;
