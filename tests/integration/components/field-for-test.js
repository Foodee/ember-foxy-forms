import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render, findAll, fillIn } from '@ember/test-helpers';
import { set } from '@ember/object';
import { run } from '@ember/runloop';
import hbs from 'htmlbars-inline-precompile';
import faker from 'faker';
import sinon from 'sinon';
import { A } from '@ember/array';

module('Integration | Component | field container', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', function (assert) {
    assert.expect(0);
  });

  test('it renders testing classes', async function (assert) {
    this.key = faker.lorem.word();

    await render(hbs`
      <FormFor as |form|>
        <form.fieldFor @params={{array this.key}} />
      </FormFor>
    `);

    assert.notEqual(findAll(`.--field-for__object_${this.key}`)[0], undefined);
  });

  test('it renders with bem classes when use bem class is true', async function (assert) {
    this.key = faker.lorem.word();

    await render(hbs`
      <FormFor as |form|>
        <form.fieldFor @params={{array this.key}} />
      </FormFor>
    `);

    assert.equal(findAll(`.rd-form-for-object__field-for-${this.key}`)[0], undefined);

    await render(hbs`
      <FormFor @useBemClass={{true}} as |form|>
        <form.fieldFor @params={{array this.key}} />
      </FormFor>
    `);
    assert.notEqual(findAll(`.rd-form-for-object__field-for-${this.key}`)[0], undefined);
  });

  test('it delegates the values param to the control', async function (assert) {
    this.key = faker.lorem.word();

    this.values = [
      {
        id: 1,
        label: faker.lorem.word(),
      },
      {
        id: 2,
        label: faker.lorem.word(),
      },
    ];

    await render(hbs`
      <FormFor as |form|>
        <form.fieldFor
          @params={{array this.key}}
          @using="select"
          @values={{this.values}}
        />
      </FormFor>
    `);

    assert.dom('[data-test-ff-control-select-option]').exists({ count: 2 });
  });

  test('it delegates the values param to the control using the string format', async function (assert) {
    this.key = faker.lorem.word();

    await render(hbs`
      <FormFor as |form|>
        <form.fieldFor @params={{array this.key}} @using="select" @values="1:foo,2:bar" />
      </FormFor>
    `);

    assert.dom('[data-test-ff-control-select-option]').exists({ count: 2 });
  });

  test('it has the ability to change the element type that the form renders as', async function (assert) {
    this.tagName = 'span';

    this.model = {
      foo: `1-${faker.lorem.word()}`,
    };

    await render(hbs`
      <FormFor @model={{this.model}} as |f|>
        <f.fieldFor @params={{array "foo"}} @tagName={{this.tagName}} />
      </FormFor>
    `);

    assert.dom(`${this.tagName}.field-for`).exists();

    run(() => {
      set(this, 'tagName', 'div'); // this is an edge case it needs to be this way
    });

    await render(hbs`
      <FormFor @model={{this.model}} as |f|>
        <f.fieldFor @params={{array "foo"}} @tagName={{this.tagName}} />
      </FormFor>
    `);
    assert.dom(`${this.tagName}.field-for`).exists();
  });

  test('it takes a control name', async function (assert) {
    this.model = {
      foo: `1-${faker.lorem.word()}`,
    };

    await render(hbs`
      <FormFor @model={{this.model}} as |f|>
        <f.fieldFor @params={{array "foo"}} @using="custom" />
      </FormFor>
    `);

    assert.dom('[data-test-ff-control-custom]').exists();
  });

  test('it takes a controlId', async function (assert) {
    this.model = {
      foo: `1-${faker.lorem.word()}`,
    };

    this.controlId = faker.lorem.word();

    await render(hbs`
      <FormFor @model={{this.model}} as |f|>
        <f.fieldFor @params={{array "foo"}} @label="My Label" @controlId={{this.controlId}} />
      </FormFor>
    `);

    assert.dom('[data-test-field-for]').exists();
    assert.dom('label').hasAttribute('for', this.controlId);
    assert.dom('input').hasAttribute('id', this.controlId);
  });

  test('it can be disabled', async function (assert) {
    this.model = { foo: 'bar' };

    await render(hbs`
      <FormFor @model={{this.model}} as |f|>
        <f.fieldFor
          @disabled={{true}}
          @params={{array "foo"}}
        />
      </FormFor>
    `);

    assert.dom('[data-test-field-for]').exists();
    assert.dom('input').hasAttribute('disabled');
  });

  test('it can be set to readonly', async function (assert) {
    this.model = { foo: 'bar' };

    await render(hbs`
      <FormFor @model={{this.model}} as |f|>
        <f.fieldFor
          @params={{array "foo"}}
          @readonly={{true}}
        />
      </FormFor>
    `);

    assert.dom('[data-test-field-for]').exists();
    assert.dom('input').hasAttribute('readonly');
  });

  test('it delegates value to the control', async function (assert) {
    this.model = { foo: 'bar' };

    await render(hbs`
      <FormFor @model={{this.model}} as |f|>
        <f.fieldFor
          @params={{array "foo"}}
        />
      </FormFor>
    `);

    assert.dom('[data-test-field-for]').exists();
    assert.dom('input').hasValue('bar');
  });

  test('it delegates values to the control', async function (assert) {
    this.model = { foo: 'bar', select: '1' };

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
    assert.dom('select').hasValue('1');
    assert.dom('option').hasValue('1');
  });

  test('it allows for optionally providing a format function for the value', async function (assert) {
    this.model = { foo: 'bar' };
    this.formatValue = sinon.spy();
    this.valueTooltip = faker.lorem.word();

    await render(hbs`
      <FormFor @model={{this.model}} as |f|>
        <f.fieldFor
          @params={{array "foo"}}
          @inlineEditing={{true}}
          @formatValue={{this.formatValue}}
          @valueTooltip={{this.valueTooltip}}
        />
      </FormFor>
    `);

    assert.dom('[data-test-field-for]').exists();
    assert.ok(this.formatValue.called);
    assert.dom(`[data-tooltip=${this.valueTooltip}]`).exists();
  });

  test('it allows for appending a tool tip to the value when in inline editing mode', async function (assert) {
    this.model = { foo: 'bar' };
    this.valueTooltip = faker.lorem.word();

    await render(hbs`
      <FormFor @model={{this.model}} as |f|>
        <f.fieldFor
          @params={{array "foo"}}
          @inlineEditing={{true}}
          @valueTooltip={{this.valueTooltip}}
        />
      </FormFor>
    `);

    assert.dom('[data-test-field-for]').exists();
    assert.dom(`[data-tooltip=${this.valueTooltip}]`).exists();
  });

  test('it can be configured to require confirmation before changes are committed', async function (assert) {
    const initiaValue = faker.lorem.word();
    const newValue = faker.lorem.word();
    this.model = { foo: initiaValue };

    await render(hbs`
      <FormFor @model={{this.model}} @requireConfirm={{true}} as |f|>
        <f.fieldFor
          @params={{array "foo"}}
        />
      </FormFor>
    `);

    assert.dom('[data-test-field-for]').exists();

    await fillIn('input', newValue);
    assert.equal(this.model.foo, initiaValue);

    await click('[data-test-commit-buttons-commit]');
    assert.equal(this.model.foo, newValue);
  });

  test('it can be configured to require confirmation before changes are canceled', async function (assert) {
    const initiaValue = faker.lorem.word();
    const newValue = faker.lorem.word();
    this.model = { foo: initiaValue };

    await render(hbs`
      <FormFor @model={{this.model}} @requireConfirm={{true}} as |f|>
        <f.fieldFor
          @params={{array "foo"}}
        />
      </FormFor>
    `);

    assert.dom('[data-test-field-for]').exists();

    await fillIn('input', newValue);
    assert.equal(this.model.foo, initiaValue);

    await click('[data-test-commit-buttons-cancel]');
    assert.equal(this.model.foo, initiaValue);
  });

  test('it can set default values on load if field is empty on form level', async function (assert) {
    this.model = {
      string: null,
      number: null,
      range: null,
      color: null,
      boolean: null,
      radio: null,
      select: null,
      objectSelect: null,
      checkboxSelect: A([]),
      checkboxSelectObject: A([]),
    };

    this.defaultValues = {
      string: 'string',
      number: 5,
      range: 5,
      color: '#fff',
      boolean: true,
      radio: '2',
      select: '2',
      objectSelect: { id: '2', label: 'two ' },
      checkboxSelect: A(['2']),
      checkboxSelectObject: A([{ id: '2', label: 'two' }]),
    };

    this.values = ['1', '2', '3'];
    this.objectValues = [
      { id: '1', label: 'one' },
      { id: '2', label: 'two' },
    ];

    await render(hbs`
      <FormFor @model={{this.model}} @defaultValues={{this.defaultValues}} as |f|>
        <f.fieldFor @for='string' @using='input'/>
        <f.fieldFor @for='color' @using='number'/>
        <f.fieldFor @for='number' @using='number'/>
        <f.fieldFor @for='range' @using='range'/>
        <f.fieldFor @for='boolean' @using='checkbox'/>
        <f.fieldFor @for='radio' @using='radio' @values={{this.values}}/>
        <f.fieldFor @for='select' @using='select' @values={{this.values}}/>
        <f.fieldFor @for='objectSelect' @using='select' @values={{this.objectValues}}/>
        <f.fieldFor @for='checkboxSelect' @using='checkbox-select' @values={{this.values}}/>
        <f.fieldFor @for='checkboxSelectObject' @using='checkbox-select' @values={{this.objectValues}}/>
      </FormFor>
    `);

    assert.equal(this.model.string, this.defaultValues.string);
    assert.equal(this.model.number, this.defaultValues.number);
    assert.equal(this.model.range, this.defaultValues.range);
    assert.equal(this.model.color, this.defaultValues.color);
    assert.equal(this.model.boolean, this.defaultValues.boolean);
    assert.equal(this.model.radio, this.defaultValues.radio);
    assert.equal(this.model.select, this.defaultValues.select);
    assert.equal(this.model.objectSelect.id, this.defaultValues.objectSelect.id);
    assert.equal(this.model.checkboxSelect, this.defaultValues.checkboxSelect);
    assert.equal(
      this.model.checkboxSelectObject.firstObject.id,
      this.defaultValues.checkboxSelectObject.firstObject.id
    );
  });

  test('it can set default values on field level', async function (assert) {
    this.model = {
      string: null,
      number: null,
      range: null,
      color: null,
      boolean: null,
      radio: null,
      select: null,
      objectSelect: null,
      checkboxSelect: A([]),
      checkboxSelectObject: A([]),
    };

    this.defaultValues = {
      string: 'string',
      number: 5,
      range: 5,
      color: '#fff',
      boolean: true,
      radio: '2',
      select: '2',
      objectSelect: { id: '2', label: 'two ' },
      checkboxSelect: A(['2']),
      checkboxSelectObject: A([{ id: '2', label: 'two' }]),
    };

    this.values = ['1', '2', '3'];
    this.objectValues = [
      { id: '1', label: 'one' },
      { id: '2', label: 'two' },
    ];

    await render(hbs`
      <FormFor @model={{this.model}} as |f|>
        <f.fieldFor @for='string' @using='input' @defaultValue={{this.defaultValues.string}} />
        <f.fieldFor @for='color' @using='number' @defaultValue={{this.defaultValues.color}} />
        <f.fieldFor @for='number' @using='number' @defaultValue={{this.defaultValues.number}} />
        <f.fieldFor @for='range' @using='range' @defaultValue={{this.defaultValues.range}} />
        <f.fieldFor @for='boolean' @using='checkbox' @defaultValue={{this.defaultValues.boolean}} />
        <f.fieldFor @for='radio' @using='radio' @values={{this.values}} @defaultValue={{this.defaultValues.radio}} />
        <f.fieldFor @for='select' @using='select' @values={{this.values}} @defaultValue={{this.defaultValues.select}} />
        <f.fieldFor @for='objectSelect' @using='select' @values={{this.objectValues}} @defaultValue={{this.defaultValues.objectSelect}} />
        <f.fieldFor @for='checkboxSelect' @using='checkbox-select' @values={{this.values}} @defaultValue={{this.defaultValues.checkboxSelect}} />
        <f.fieldFor @for='checkboxSelectObject' @using='checkbox-select' @defaultValue={{this.defaultValues.checkboxSelectObject}}/>
      </FormFor>
    `);

    assert.equal(this.model.string, this.defaultValues.string);
    assert.equal(this.model.number, this.defaultValues.number);
    assert.equal(this.model.range, this.defaultValues.range);
    assert.equal(this.model.color, this.defaultValues.color);
    assert.equal(this.model.boolean, this.defaultValues.boolean);
    assert.equal(this.model.radio, this.defaultValues.radio);
    assert.equal(this.model.select, this.defaultValues.select);
    assert.equal(this.model.objectSelect.id, this.defaultValues.objectSelect.id);
    assert.equal(this.model.checkboxSelect, this.defaultValues.checkboxSelect);
    assert.equal(
      this.model.checkboxSelectObject.firstObject.id,
      this.defaultValues.checkboxSelectObject.firstObject.id
    );
  });
});
