// BEGIN-SNIPPET basic-usage.js
import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
export default class UsageController extends Controller {
  anObject = {
    @tracked text: 'bar',
    @tracked select: '1',
    @tracked start: '1',
    @tracked end: '1',
  };
}
// END-SNIPPET
