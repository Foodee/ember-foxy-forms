import Ember from 'ember';
import layout from '../templates/components/form-button';

const {
  computed,
  get
} = Ember;

export default Ember.Component.extend({
  layout,

  config: computed(function () {
    return get(Ember.getOwner(this).resolveRegistration('config:environment'), 'APP.ember-foxy-forms');
  }),

  tagName: '',

  icon: null,

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
