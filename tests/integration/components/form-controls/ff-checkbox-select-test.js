import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | form-controls/ff-checkbox-select', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders objects into checkbox lists', async function (assert) {
    this.values = [
      {
        id: '1',
        label: '1',
      },
      {
        id: '2',
        label: 'two',
      },
    ];
    await render(hbs`<FormControls::FfCheckboxSelect @values={{this.values}}/>`);

    assert
      .dom('[data-test-ff-control-checkbox-select-input]')
      .exists({ count: 2 })
      .hasAttribute(
        'type',
        'checkbox',
        'Should render a checkbox input for each of the object values'
      );
  });

  test('it renders primitive values into checkbox lists', async function (assert) {
    this.values = ['1', '2'];
    await render(hbs`<FormControls::FfCheckboxSelect @values={{this.values}}/>`);

    assert
      .dom('[data-test-ff-control-checkbox-select-input]')
      .exists({ count: 2 })
      .hasAttribute(
        'type',
        'checkbox',
        'Should render a checkbox input for each of the object values'
      );
  });

  test('it allows selection of object values', async function (assert) {
    this.values = [
      {
        id: '1',
        label: '1',
      },
      {
        id: '2',
        label: 'two',
      },
    ];
    this.value = [];

    await render(
      hbs`<FormControls::FfCheckboxSelect @value={{this.value}} @values={{this.values}} @onChange={{action (mut this.value)}} />`
    );

    await click('[data-test-ff-control-checkbox-select-input="0"]');

    assert.equal(this.value[0].id, '1');
  });

  test('it renders primitive values into checkbox lists', async function (assert) {
    this.values = ['1', '2'];
    this.value = [];

    await render(
      hbs`<FormControls::FfCheckboxSelect @value={{this.value}} @values={{this.values}} @onChange={{action (mut this.value)}}/>`
    );

    await click('[data-test-ff-control-checkbox-select-input="0"]');

    assert.equal(this.value[0], '1');
  });


  test('it allows yielding to provide a custom label', async function (assert) {
    this.values = ['1'];

    await render(
      hbs`
          <FormControls::FfCheckboxSelect @values={{this.values}} as |value inputId| >
            <div data-test-custom-element>{{value}}</div>
          </FormControls::FfCheckboxSelect>
      `
    );

    assert
      .dom('[data-test-custom-element]')
      .hasText('1');
 });
});
