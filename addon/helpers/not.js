import Helper from '@ember/component/helper';

/**
 * Performs an inversion of the first argument, it will
 * type cast the value if need be.
 *
 * x
 *
 * @param {*} a
 * @returns {boolean}
 */
export function not([a]) {
  return !a;
}

export default Helper.helper(not);
