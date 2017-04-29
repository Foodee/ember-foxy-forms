import Ember from 'ember';

const {
  isArray
} = Ember;

/**
 * Strips 'ember-view' from the class names list passed to our tagless components
 * @param classNames
 * @returns {string}
 */
export function stripClassNames([classNames = []]) {

  if (!isArray(classNames)) {
    classNames = classNames.split(',');
  }

  return classNames.filter(_ => _ !== 'ember-view').join(' ');
}

export default Ember.Helper.helper(stripClassNames);
