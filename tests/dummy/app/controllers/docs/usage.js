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
    @tracked radio: '1',
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
        string: ['String Error'],
        password: ['Password Error'],
        text: ['Text Error'],
        email: ['Email Error'],
        url: ['URL Error'],
        tel: ['TEL Error'],
        search: ['Search Error'],
        number: ['Number Error'],
        currency: ['Currency Error'],
        numberRange: ['Number Range Error'],
        color: ['Color Error'],
        date: ['Date Error'],
        time: ['Time Error'],
        datetime: ['Datetime Error'],
        boolean: ['Boolean Error'],
        select: ['Select Error'],
        radio: ['Select Error'],
        start: ['Start Error'],
        end: ['End Error'],
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
}
