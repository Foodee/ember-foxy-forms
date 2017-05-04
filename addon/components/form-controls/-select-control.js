import Ember from 'ember';
import layout from '../../templates/components/form-controls/-select-control';

export default Ember.Component.extend({
  layout,

  value: null,

  values: null,

  idKey: 'id',

  labelKey: 'label',

  onChange(/* value */){
  }

});
