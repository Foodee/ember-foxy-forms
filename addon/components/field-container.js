import Ember from 'ember';
import layout from '../templates/components/field-container';

const {
  defineProperty,
  computed
} = Ember;

const FieldContainer = Ember.Component.extend({

  layout,

  tagName: '',

  model: null,

  key: '',

  label: null,

  fieldComponent: null,

  form: null,

  autoCommit: computed.oneWay('form.autoCommit'),

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

FieldContainer.reopenClass({
  positionalParams: ['key']
});

export default FieldContainer;
