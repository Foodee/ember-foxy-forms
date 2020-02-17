import { helper } from '@ember/component/helper';

export default helper(function jsonPrettyPrint([value] /*, hash*/) {
  return JSON.stringify(value, null, 2);
});
