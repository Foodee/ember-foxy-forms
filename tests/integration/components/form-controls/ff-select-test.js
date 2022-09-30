import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | form-controls/ff-select', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(hbs`<FormControls::FfSelect />`);

    assert
      .dom('[data-test-ff-control-select]')
      .exists({ count: 1 }, 'Should render select control');
  });

  test('selects the correct value on first render', async function (assert) {
    this.model = { foo: 'bar', select: '2' };

    await render(hbs`
      <FormFor @model={{this.model}} as |form|>
        <form.field
          @for="select"
          @using="select"
          @label="Select"
          @values="1:one,2:two,3:three"
          @valueTooltip="An Select"
        />
      </FormFor>
    `);

    assert.dom('[data-test-field-for]').exists();
    assert.dom('select').hasValue('2');
  });

  test('it renders placeholder when no value is set', async function (assert) {
    this.model = { foo: 'bar' };

    await render(hbs`
      <FormFor @model={{this.model}} as |form|>
        <form.field
          @for="select"
          @using="select"
          @label="Select"
          @values="1:one,2:two,3:three"
          @valueTooltip="An Select"
        />
      </FormFor>
    `);

    assert.dom('[data-test-field-for]').exists();
    assert.dom('[data-tests-ff-control-select-placeholder]').exists();
    assert.dom('select').hasNoValue();
  });

  test('it renders unknown value when value isnt present in the values set', async function (assert) {
    this.model = { foo: 'bar', select: '4' };

    await render(hbs`
      <FormFor @model={{this.model}} as |form|>
        <form.field
          @for="select"
          @using="select"
          @label="Select"
          @values="1:one,2:two,3:three"
          @valueTooltip="An Select"
        />
      </FormFor>
    `);

    assert.dom('[data-test-field-for]').exists();
    assert.dom('[data-tests-ff-control-select-unknown-value]').exists();
    assert.dom('select').hasValue('4');
  });

  test('it renders disabled options if option has disabled true', async function (assert) {
    this.model = { foo: 'bar', select: '4' };
    this.values = [
      { id: 1, label: 'one' },
      { id: 2, label: 'two', disabled: true },
      { id: 3, label: 'three' },
    ];
    await render(hbs`
      <FormFor @model={{this.model}} as |form|>
        <form.field
          @for="select"
          @using="select"
          @label="Select"
          @values={{this.values}}
          @valueTooltip="An Select"
        />
      </FormFor>
    `);

    assert.dom('[data-test-field-for]').exists();
    assert.dom('[data-test-ff-control-select]').exists();
    assert.dom('[data-test-ff-control-select] option[value="2"]').hasAttribute('disabled');
  });
});
