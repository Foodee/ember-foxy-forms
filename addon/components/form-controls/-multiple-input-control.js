import Ember from 'ember';
import layout from '../../templates/components/form-controls/-multiple-input-control';

const {
  computed
} = Ember;

export default Ember.Component.extend({
  layout,

  _inputs: computed('value', function () {
    return Object.keys(this.get('value') || []).map((key, index) => ({
      key: key,
      id: index
    }));
  }),

  _sendChange(newValue){
    this.onChange(Object.assign({}, this.get('value'), newValue));
  },

  onChange(/*value*/){
  },

  actions: {

    handleValueChange(key, event){
      this._sendChange({[key]: event.target.value});
    }
  }
});
