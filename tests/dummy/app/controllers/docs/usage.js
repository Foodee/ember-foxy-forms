import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { A } from '@ember/array';

export default class UsageController extends Controller {
  anObject = {
    @tracked string: 'string',
    @tracked text: 'text',
    @tracked email: 'foxy@forms.com',
    @tracked url: 'https://google.ca',
    @tracked tel: '9999999999',
    @tracked search: 'seaarch',
    @tracked number: 1,
    @tracked currency: 1.23,
    @tracked numberLow: 1,
    @tracked numberHigh: 10,
    @tracked color: '#ff0000',
    @tracked date: new Date().toString(),
    @tracked time: new Date().toString(),
    @tracked datetime: new Date().toString(),
    @tracked boolean: false,
    @tracked select: '1',
    @tracked selectObject: { id: '1', label: 'One' },
    @tracked checkboxSelect: A(['1']),
    @tracked checkboxSelectObject: A([{ id: '1', label: 'One' }]),
    @tracked radio: '1',
    @tracked radioSelectObject: { id: '1', label: 'One' },
    @tracked start: '1',
    @tracked end: '1',
    @tracked errors: {},
  };

  @tracked
  errors = false;

  @action
  toggleErrors() {
    if (this.errors) {
      this.anObject.errors = {
        string: [{message:'String Error'}],
        password: [{message:'Password Error'}],
        text: [{message:'Text Error'}],
        email: [{message:'Email Error'}],
        url: [{message:'URL Error'}],
        tel: [{message:'TEL Error'}],
        search: [{message:'Search Error'}],
        number: [{message:'Number Error'}],
        currency: [{message:'Currency Error'}],
        numberRange: [{message:'Number Range Error'}],
        color: [{message:'Color Error'}],
        date: [{message:'Date Error'}],
        time: [{message:'Time Error'}],
        datetime: [{message:'Datetime Error'}],
        boolean: [{message:'Boolean Error'}],
        select: [{message:'Select Error'}],
        radio: [{message:'Select Error'}],
        start: [{message:'Start Error'}],
        end: [{message:'End Error'}],
      };
    } else {
      this.anObject.errors = {
        text: [],
        select: [],
        start: [],
        end: [],
      };
    }
  }

  @tracked preventsNavigation = false;
  @tracked inline = false;
  @tracked hasControlCallout = false;
  @tracked autoSubmit = false;
  @tracked requiresConfirm = false;
  @tracked disabled = false;
  @tracked readonly = false;
  @tracked logs = A();

  @tracked enableSubmit = true;
  @tracked successfulSubmitMessage = 'We submitted!';
  @tracked failedSubmitMessage = 'We failed to submit!';
  @tracked didNotSubmitMessage = 'We did not submit!';

  @action
  willSubmit() {
    return this.enableSubmit;
  }

  @action
  async submit() {
    this.logs.pushObject('submitting');
    await new Promise((r) => setTimeout(r, 2000));
  }

  @action
  async didSubmit() {
    this.logs.pushObject('submitted!');
  }

  @action
  async didNotSubmit() {
    this.logs.pushObject('did not submit!');
  }

  @tracked enableReset = true;
  @tracked successfulResetMessage = 'We Reset!';
  @tracked failedResetMessage = 'We failed to reset!';
  @tracked didNotResetMessage = 'We did not reset!';

  @action
  willReset() {
    return this.enableReset;
  }

  @action
  async reset() {
    this.logs.pushObject('resetting');
    await new Promise((r) => setTimeout(r, 2000));
  }

  @action
  async didReset() {
    this.logs.pushObject('reset!');
  }

  @action
  async didNotReset() {
    this.logs.pushObject('did not reset!');
  }

  @tracked enableDestroy = true;
  @tracked successfulDestroyMessage = 'We Destroyed';
  @tracked failedDestroyMessage = 'We failed to destroy!';
  @tracked didNotDestroyMessage = 'We did not destroy!';

  @action
  willDestroy() {
    return this.enableDestroy;
  }

  @action
  async destroy() {
    this.logs.pushObject('destroying');
    await new Promise((r) => setTimeout(r, 2000));
  }

  @action
  async didDestroy() {
    this.logs.pushObject('destroyed!');
  }

  @action
  async didNotDestroy() {
    this.logs.pushObject('did not destroy!');
  }

  @action
  async failedDestroyModel() {
    this.logs.pushObject('did not destroy!');
  }
}
