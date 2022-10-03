import Helper from '@ember/component/helper';

/**
 * Checks to see if any of the passed in arguments are true
 * @param {boolean[]} values
 * @returns {boolean}
 */
export function or(values) {
  return values.reduce((acc, arg) => acc || arg, false);
}

export default Helper.helper(or);
