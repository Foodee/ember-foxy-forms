import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import faker from 'faker';
import sinon from 'sinon';

module('Integration | Component | form button', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(hbs`<FormButton />`);

    assert.dom('[data-test-form-button]').hasText('');

    // Template block usage:
    await render(hbs`
    <FormButton>
      template block text
    </FormButton>
    `);

    assert.dom('[data-test-form-button]').hasText('template block text');
  });

  test('has a text attribute', async function (assert) {
    this.text = faker.lorem.word();

    await render(hbs`<FormButton @text={{this.text}} />`);

    assert.dom('[data-test-form-button]').hasText(this.text);
  });

  test('has a icon attribute', async function (assert) {
    this.icon = faker.lorem.word();

    await render(hbs`<FormButton @icon={{this.icon}} />`);

    assert.dom('[data-test-form-button-icon]').hasClass(this.icon);
  });

  test('responds to click events', async function (assert) {
    this.onClick = sinon.spy();

    await render(hbs`<FormButton @onClick={{this.onClick}} />`);

    assert.ok('[data-test-form-button]');

    await click('[data-test-form-button]');

    assert.ok(this.onClick.calledOnce);
  });
});
