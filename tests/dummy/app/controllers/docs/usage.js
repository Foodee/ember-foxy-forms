import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { A } from '@ember/array';

export default class UsageController extends Controller {
  anObject = {
    @tracked string: null,
    @tracked text: null,
    @tracked email: null,
    @tracked url: null,
    @tracked tel: null,
    @tracked search: null,
    @tracked number: null,
    @tracked currency: null,
    @tracked numberLow: null,
    @tracked numberHigh: null,
    @tracked color: null,
    @tracked date: null,
    @tracked time: null,
    @tracked datetime: null,
    @tracked boolean: null,
    @tracked select: null,
    @tracked selectObject: null,
    @tracked selectObjectWithDisabledOption: null,
    @tracked checkboxSelect: A([]),
    @tracked checkboxSelectObject: A([]),
    @tracked radio: null,
    @tracked radioObject: null,
    @tracked start: '1',
    @tracked end: '1',
    @tracked errors: {},
  };

  defaultValues = {
    string: 'string',
    text: 'text',
    email: 'foxy@forms.com',
    url: 'https://google.ca',
    tel: '9999999999',
    search: 'seaarch',
    number: 6,
    currency: 1.23,
    numberLow: 1,
    numberHigh: 10,
    color: '#ff0000',
    date: new Date().toString(),
    time: new Date().toString(),
    datetime: new Date().toString(),
    boolean: false,
    select: '1',
    selectObject: { id: '1', label: 'one' },
    selectObjectWithDisabledOption: { id: '1', label: 'one' },
    checkboxSelect: A(['1']),
    checkboxSelectObject: A([{ id: '1', label: 'one' }]),
    radio: '1',
    radioObject: { id: '1', label: 'one' },
  };

  valuesForSelectObjectWithDisabledOption = [
    { id: '1', label: 'one' },
    { id: '2', label: 'two', disabled: true },
    { id: '3', label: 'three' },
  ];

  @tracked
  errors = false;

  @tracked
  scrollToVisible = false;

  @action
  toggleErrors() {
    if (this.errors) {
      this.anObject.errors = {
        string: [{ message: 'String Error' }],
        password: [{ message: 'Password Error' }],
        text: [{ message: 'Text Error' }],
        email: [{ message: 'Email Error' }],
        url: [{ message: 'URL Error' }],
        tel: [{ message: 'TEL Error' }],
        search: [{ message: 'Search Error' }],
        number: [{ message: 'Number Error' }],
        currency: [{ message: 'Currency Error' }],
        numberRange: [{ message: 'Number Range Error' }],
        color: [{ message: 'Color Error' }],
        date: [{ message: 'Date Error' }],
        time: [{ message: 'Time Error' }],
        datetime: [{ message: 'Datetime Error' }],
        boolean: [{ message: 'Boolean Error' }],
        select: [{ message: 'Select Error' }],
        radio: [{ message: 'Select Error' }],
        start: [{ message: 'Start Error' }],
        end: [{ message: 'End Error' }],
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
  @tracked useBemClass = false;

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
