import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import faker from 'faker';

module('Integration | Component | form-controls/ff-multiple-input', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    const valueOne = faker.lorem.word();
    const valueTwo = faker.lorem.word();
    const valueThree = faker.lorem.word();

    this.value = { valueOne, valueTwo, valueThree };

    await render(hbs`<FormControls::FfMultipleInput @value={{this.value}} />`);

    assert.dom('[data-test-multiple-input]').exists();
  });
});
