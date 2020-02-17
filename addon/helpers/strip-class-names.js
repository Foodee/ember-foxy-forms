import { helper as buildHelper } from '@ember/component/helper';
import { isArray } from '@ember/array';

/**
 * Strips 'ember-view' from the class names list passed to our tagless components
 * @param classNames
 * @returns {string}
 */
export function stripClassNames([classNames = []]) {
  if (!isArray(classNames)) {
    classNames = classNames.split(',');
  }

  return classNames
    .filter((_) => _ !== 'ember-view')
    .join(' ')
    .trim();
}

export default buildHelper(stripClassNames);
