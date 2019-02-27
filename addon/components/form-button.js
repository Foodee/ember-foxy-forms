import Ember from 'ember';
import layout from '../templates/components/form-button';

const {
  computed,
  getOwner,
} = Ember;

export default Ember.Component.extend({
  layout,

  config: computed(function () {
    return Object.assign({}, getOwner(this).resolveRegistration('config:environment').APP['ember-foxy-forms']);
  }),

  tagName: '',

  icon: null,

  bubbles: true,

  onClick() {
  },

  actions: {

    handleClick(){
      if (!this.get('isActing')) {
        this.onClick();
      }
    }

  }

});
