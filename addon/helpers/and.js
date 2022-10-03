import Helper from '@ember/component/helper';

/**
 * Checks to see if all of the passed in arguments are true
 * @param {boolean[]} values
 * @returns {boolean}
 */
export function or(values) {
  return values.reduce((acc, arg) => {
    if (arg && acc) {
      return true;
    }
    return false;
  }, true);
}

export default Helper.helper(or);
