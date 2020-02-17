import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import faker from 'faker';
import sinon from 'sinon';

module('Integration | Component | form-controls/ff-checkbox', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    this.value = faker.lorem.word();
    this.label = faker.lorem.word();
    this.onChange = sinon.spy();

    await render(
      hbs`<FormControls::FfCheckbox @value={{this.value}} @disabled={{true}} @label={{this.label}} @onChange={{this.onChange}} />`
    );

    assert
      .dom('[data-test-ff-control-checkbox]')
      .exists({ count: 1 })
      .hasAttribute('type', 'checkbox', 'Should render a checkbox input');
    assert.dom('[data-test-ff-control-checkbox]').hasAttribute('disabled');
    assert.dom('[data-test-ff-control-checkbox-label]').hasText(this.label);
  });

  test('it triggers action', async function (assert) {
    this.onChange = sinon.spy();

    await render(hbs`<FormControls::FfCheckbox @onChange={{this.onChange}} />`);
    assert.dom('[data-test-ff-control-checkbox]').exists();

    await click('[data-test-ff-control-checkbox]');
    assert.ok(this.onChange.calledOnce, 'should call onChange on click');
  });

  test('it triggers action', async function (assert) {
    await render(hbs`<FormControls::FfCheckbox @onChange={{this.onChange}} />`);
    assert.dom('[data-test-ff-control-checkbox]').exists();
  });
});
