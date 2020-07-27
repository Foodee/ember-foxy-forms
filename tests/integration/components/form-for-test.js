import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, findAll, fillIn, triggerEvent } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import Model from '@ember-data/model';
import { run } from '@ember/runloop';
import { set, setProperties } from '@ember/object';
import faker from 'faker';
import sinon from 'sinon';

module('Integration | Component | form for', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(hbs`<FormFor />`);

    assert.dom('[data-test-form-for]').exists();

    // Template block usage:
    await render(hbs`
      <FormFor>
        template block text
      </FormFor>
    `);

    assert.dom('[data-test-form-for]').hasText('template block text');
  });

  test('it binds the field value down to the control', async function (assert) {
    this.model = {
      foo: `1-${faker.lorem.word()}`,
    };

    await render(hbs`
      <FormFor @model={{this.model}} as |f|>
        <f.fieldFor @params={{array "foo"}} />
      </FormFor>
    `);

    assert.dom('input').hasValue(this.model.foo);

    run(() => {
      set(this, 'model.foo', `2-${faker.lorem.word()}`);
    });

    assert.dom('input').hasValue(this.model.foo);
  });

  test('it propagates changes to the form model', async function (assert) {
    this.model = {
      foo: faker.lorem.word(),
    };

    await render(hbs`
      <FormFor @model={{this.model}} as |f|>
        <f.fieldFor @params={{array "foo"}} />
      </FormFor>
    `);

    const newFoo = faker.lorem.word();
    await fillIn('input', newFoo);
    await triggerEvent('input', 'change');

    assert.equal(this.model.foo, newFoo);
  });

  test('it binds the multiple field values down to the control', async function (assert) {
    this.model = {
      valueOne: faker.lorem.word(),
      valueTwo: faker.lorem.word(),
      valueThree: faker.lorem.word(),
    };

    await render(hbs`
      <FormFor @model={{this.model}} as |f|>
        <f.fieldFor @params={{array "valueOne" "valueTwo" "valueThree"}} />
      </FormFor>
    `);

    assert.dom('input.input-0').hasValue(this.model.valueOne);
    assert.dom('input.input-1').hasValue(this.model.valueTwo);
    assert.dom('input.input-2').hasValue(this.model.valueThree);

    run(() => {
      setProperties(this, 'model', {
        valueOne: faker.lorem.word(),
        valueTwo: faker.lorem.word(),
        valueThree: faker.lorem.word(),
      });
    });

    assert.dom('input.input-0').hasValue(this.model.valueOne);
    assert.dom('input.input-1').hasValue(this.model.valueTwo);
    assert.dom('input.input-2').hasValue(this.model.valueThree);
  });

  test('it propagates the multiple changes to the form model', async function (assert) {
    const valueOne = faker.lorem.word();
    const valueTwo = faker.lorem.word();
    const valueThree = faker.lorem.word();

    this.model = { valueOne, valueTwo, valueThree };

    await render(hbs`
      <FormFor @model={{this.model}} as |f|>
        <f.fieldFor @params={{array "valueOne" "valueTwo" "valueThree"}} />
      </FormFor>
    `);

    const newFoo = faker.lorem.word();
    await fillIn('input.input-0', newFoo);
    await triggerEvent('input.input-0', 'change');
    assert.equal(this.model.valueOne, newFoo);
  });

  test('it binds the multiple field values down to the control with the mapping ', async function (assert) {
    const foo = faker.lorem.word();
    const bar = faker.lorem.word();
    const baz = faker.lorem.word();

    this.model = { foo, bar, baz };

    await render(hbs`
      <FormFor @model={{this.model}} as |f|>
        <f.fieldFor
          @params={{array "foo" "bar" "baz"}}
          @withMapping={{hash foo="valueOne" bar="valueTwo" baz="valueThree"}}
        />
      </FormFor>
    `);

    assert.dom('input.input-0').hasValue(foo);
    assert.dom('input.input-1').hasValue(bar);
    assert.dom('input.input-2').hasValue(baz);

    run(() => {
      setProperties(this, 'model', {
        foo: faker.lorem.word(),
        bar: faker.lorem.word(),
        baz: faker.lorem.word(),
      });
    });

    assert.dom('input.input-0').hasValue(this.model.foo);
    assert.dom('input.input-1').hasValue(this.model.bar);
    assert.dom('input.input-2').hasValue(this.model.baz);
  });

  test('it propagates the multiple changes to the form model with the mapping', async function (assert) {
    const foo = faker.lorem.word();
    const bar = faker.lorem.word();
    const baz = faker.lorem.word();

    this.model = { foo, bar, baz };

    await render(hbs`
      <FormFor @model={{this.model}} as |f|>
        <f.fieldFor
          @params={{array "foo" "bar" "baz"}}
          @withMapping={{hash foo="valueOne" bar="valueTwo"baz="valueThree"}}
        />
      </FormFor>
    `);

    const newFoo = faker.lorem.word();
    await fillIn('input.input-0', newFoo);
    await triggerEvent('input.input-0', 'change');
    assert.equal(this.model.foo, newFoo);
  });

  test('it hides the control when inlineEditing', async function (assert) {
    this.model = { foo: 'bar' };

    await render(hbs`
      <FormFor @model={{this.model}} as |f|>
        <f.FieldFor
          @params={{array "foo"}}
          @inlineEditing={{true}}
        />
      </FormFor>
    `);

    assert.equal(findAll('input')[0], undefined);
  });

  test('it shows the control and hides the value when inline-editing and the value is clicked', async function (assert) {
    this.model = { foo: 'bar' };

    await render(hbs`
      <FormFor @model={{this.model}} as |f|>
        <f.fieldFor
          @params={{array "foo"}}
          @inlineEditing={{true}}
        />
      </FormFor>
    `);

    await click('.field-for-value-container');

    assert.dom('input').hasValue('bar');
    assert.equal(findAll('.field-for-value-container')[0], undefined);
  });

  test('it hides the control inline-editing when commited or canceled with no errors', async function (assert) {
    this.model = { foo: 'bar' };

    await render(hbs`
      <FormFor @model={{this.model}} as |f|>
        <f.fieldFor @params={{array "foo"}} @inlineEditing={{true}} />
      </FormFor>
    `);

    await click('.field-for-value-container');
    assert.dom('input').hasValue('bar');
    await click('button.commit');
    assert.equal(findAll('input')[0], undefined);

    await click('.field-for-value-container');
    assert.dom('input').hasValue('bar');
    await click('button.cancel');
    assert.equal(findAll('input')[0], undefined);
  });

  test('it does not hide the control when inline-editing when there are errors', async function (assert) {
    this.model = { foo: 'bar', errors: { foo: [{ message: 'bar error' }] } };

    await render(hbs`
      <FormFor @model={{this.model}} as |f|>
        <f.fieldFor @params={{array "foo"}} @inlineEditing={{true}} />
      </FormFor>
    `);
    await click('.field-for-value-container');
    assert.dom('input').hasValue('bar');
    await click('[data-test-commit-buttons-commit]');
    assert.dom('input').hasValue('bar');
    assert.dom('[data-test-form-error]').hasText('bar error');
    await click('[data-test-commit-buttons-cancel]');
    assert.dom('[data-test-form-error]').hasText('bar error');
  });

  test('it shows the control and the value when inline-editing and has-control-callout and the value is clicked', async function (assert) {
    this.model = { foo: 'bar' };

    await render(hbs`
      <FormFor @model={{this.model}} as |f|>
        <f.fieldFor
          @params={{array "foo"}}
          @inlineEditing={{true}}
          @hasControlCallout={{true}}
        />
      </FormFor>
    `);

    await click('.field-for-value-container');

    assert.dom('input').hasValue('bar');
    assert.notEqual(findAll('.field-for-value-container')[0], undefined);
  });

  test('it should use the model name to build the testing class', async function (assert) {
    this.modelName = faker.lorem.word();
    this.model = {};

    await render(hbs`
      <FormFor @model={{this.model}} @modelName={{this.modelName}} as |f|>
        <f.fieldFor
          @params={{array "foo"}}
          @inlineEditing={{true}}
          @hasControlCallout={{true}}
        />
      </FormFor>
    `);

    assert.notEqual(findAll(`.--form-for__${this.modelName}`)[0], undefined);
  });

  test('it should use the ember data model name to build the testing class', async function (assert) {
    const modelName = faker.lorem.word();

    const modelClass = Model.extend({});
    this.owner.register(`model:${modelName}`, modelClass);
    this.model = null;

    run(() => {
      this.model = this.owner.lookup('service:store').createRecord(modelName);
    });

    await render(hbs`
      <FormFor @model={{this.model}} as |f|>
        <f.fieldFor
          @params={{array "foo"}}
          @inlineEditing={{true}}
          @hasControlCallout={{true}}
        />
      </FormFor>
    `);

    assert.notEqual(findAll(`.--form-for__${modelName}`)[0], undefined);
  });

  test('it should use the object model name to build the testing class', async function (assert) {
    this.model = {
      modelName: faker.lorem.word(),
    };

    await render(hbs`<FormFor @model={{this.model}} />`);

    assert.notEqual(findAll(`.--form-for__${this.model.modelName}`)[0], undefined);
  });

  test('it has the ability to change the element type that the form renders as', async function (assert) {
    this.tagName = 'span';

    await render(hbs`<FormFor  @tagName={{this.tagName}} />`);
    assert.dom(`${this.tagName}.form-for`).exists();

    run(() => {
      set(this, 'tagName', 'div'); // this is an edge case it needs to be this way
    });

    await render(hbs`<FormFor  @tagName={{this.tagName}} />`);
    assert.dom(`${this.tagName}.form-for`).exists();
  });

  test('it appends a testing class to the form, and a testing data attribute', async function (assert) {
    this.forForService = this.owner.lookup('service:form-for');
    run(() => {
      this.forForService.testingClassPrefix = 'testing--';
    });
    await render(hbs`<FormFor  data-test-custom-test/>`);

    assert.dom(`.${this.forForService.testingClassPrefix}form-for__object`).exists();
    assert.dom('[data-test-custom-test]').exists();
  });

  test('it allows for the registration of child forms', async function (assert) {
    this.model = { foo: 'bar' };
    const newValue = faker.lorem.word();

    await render(hbs`
      <FormFor @model={{this.model}} as |f|>
        <f.fieldFor
          @params={{array "foo"}}
        />
        <Form @for={{object}} @parentForm={{f.self}} as |f2|>
          <f2.submit />
        </Form>
      </FormFor>
    `);

    assert.dom('[data-test-form-for]').exists();
    await fillIn('input', newValue);
    await click('.submit');
    assert.dom('input').hasValue(newValue);
    assert.equal(this.model.foo, newValue);
  });

  test('it can be disabled', async function (assert) {
    this.model = { foo: 'bar' };

    await render(hbs`
      <FormFor @model={{this.model}} @disabled={{true}} as |f|>
        <f.fieldFor
          @params={{array "foo"}}
        />
      </FormFor>
    `);

    assert.dom('[data-test-form-for]').exists();
    assert.dom('[data-test-form-for]').hasClass('disabled');
    assert.dom('[data-test-field-for]').exists();
    assert.dom('[data-test-field-for]').hasClass('disabled');
  });

  test('it can be set to readonly', async function (assert) {
    this.model = { foo: 'bar' };

    await render(hbs`
      <FormFor @model={{this.model}} @readonly={{true}} as |f|>
        <f.fieldFor
          @params={{array "foo"}}
        />
      </FormFor>
    `);

    assert.dom('[data-test-form-for]').exists();
    assert.dom('[data-test-form-for]').hasClass('readonly');
    assert.dom('[data-test-field-for]').exists();
    assert.dom('[data-test-field-for]').hasClass('readonly');
  });

  test('it runs all lifecycle hoooks when reseting the form', async function (assert) {
    sinon.stub(window, 'confirm').returns(true);

    this.model = { foo: 'bar' };

    this.willSubmit = sinon.spy();
    this.willReset = sinon.spy();
    this.willDestroy = sinon.spy();

    await render(hbs`
      <FormFor
        @model={{this.model}}
        @willSubmit={{this.willSubmit}}
        @willReset={{this.willReset}}
        @willDestroyModel={{this.willDestroy}}
      as |form|>
        <form.fieldFor
          @params={{array "foo"}}
        />
        <form.submit/>
        <form.reset/>
        <form.destroy/>
      </FormFor>
    `);

    assert.dom('[data-test-form-for]').exists();
    await click('.submit');
    assert.ok(this.willSubmit.calledOnce);
    await click('.reset');
    assert.ok(this.willReset.calledOnce);
    await click('.destroy');
    assert.ok(this.willDestroy.calledOnce);

    this.didSubmit = sinon.spy();
    this.didReset = sinon.spy();
    this.didDestroy = sinon.spy();

    await render(hbs`
      <FormFor
        @model={{this.model}}
        @didSubmit={{this.didSubmit}}
        @didReset={{this.didReset}}
        @didDestroyModel={{this.didDestroy}}
      as |form|>
        <form.fieldFor
          @params={{array "foo"}}
        />
        <form.submit/>
        <form.reset/>
        <form.destroy/>
      </FormFor>
    `);

    assert.dom('[data-test-form-for]').exists();
    await click('.submit');
    assert.ok(this.didSubmit.calledOnce);
    await click('.reset');
    assert.ok(this.didReset.calledOnce);
    await click('.destroy');
    assert.ok(this.didDestroy.calledOnce);

    this.didNotSubmit = sinon.spy();
    this.didNotReset = sinon.spy();
    this.didNotDestroy = sinon.spy();

    await render(hbs`
      <FormFor
        @model={{this.model}}
        @willSubmit={{noop}}
        @willReset={{noop}}
        @willDestroyModel={{noop}}
        @didNotSubmit={{this.didNotSubmit}}
        @didNotReset={{this.didNotReset}}
        @didNotDestroyModel={{this.didNotDestroy}}

      as |form|>
        <form.fieldFor
          @params={{array "foo"}}
        />
        <form.submit/>
        <form.reset/>
        <form.destroy/>
      </FormFor>
    `);

    assert.dom('[data-test-form-for]').exists();
    await click('.submit');
    assert.ok(this.didNotSubmit.calledOnce);
    await click('.reset');
    assert.ok(this.didNotReset.calledOnce);
    await click('.destroy');
    assert.ok(this.didNotDestroy.calledOnce);
  });

  test('submitting the form calls save on the model by default', async function (assert) {
    const value = faker.lorem.word();
    this.model = {
      foo: value,
      save: sinon.stub().returns(Promise.resolve()),
    };

    const newValue = faker.lorem.word();

    await render(hbs`
      <FormFor @model={{this.model}} as |form|>
        <form.fieldFor
          @params={{array "foo"}}
        />
        <form.submit />
      </FormFor>
    `);

    assert.dom('[data-test-form-for]').exists();
    await fillIn('input', newValue);
    await click('.submit');
    assert.ok(this.model.save.calledOnce);
  });

  test('resetting the form returns the model to its initial state', async function (assert) {
    const value = faker.lorem.word();
    this.model = { foo: value };
    const newValue = faker.lorem.word();

    await render(hbs`
      <FormFor @model={{this.model}} as |form|>
        <form.fieldFor
          @params={{array "foo"}}
        />
        <form.submit />
        <form.reset />
      </FormFor>
    `);

    assert.dom('[data-test-form-for]').exists();
    await fillIn('input', newValue);
    await click('.reset');
    assert.equal(this.model.foo, value);
  });
});
