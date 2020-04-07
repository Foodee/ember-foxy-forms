import { run } from '@ember/runloop';
import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, findAll, fillIn, triggerEvent } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import Model from '@ember-data/model';

import faker from 'faker';

module('Integration | Component | form for', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(hbs`<FormFor />`);

    assert.dom('*').hasText('');

    // Template block usage:
    await render(hbs`
      <FormFor>
        template block text
      </FormFor>
    `);

    assert.dom('.form-for').hasText('template block text');
  });

  test('it binds the field value down to the control', async function (assert) {
    this.model = EmberObject.create({
      foo: `1-${faker.lorem.word()}`,
    });

    await render(hbs`
      <FormFor @model={{this.model}} as |f|>
        <f.fieldFor @params={{array "foo"}} />
      </FormFor>
    `);

    assert.dom('input').hasValue(this.model.foo);

    run(() => {
      this.model.set('foo', `2-${faker.lorem.word()}`);
    });

    assert.dom('input').hasValue(this.model.foo);
  });

  test('it propagates changes to the form model', async function (assert) {
    const foo = faker.lorem.word();

    const model = EmberObject.create({
      foo: foo,
    });

    this.set('model', model);

    await render(hbs`
      <FormFor @model={{this.model}} as |f|>
        <f.fieldFor @params={{array "foo"}} />
        </FormFor>
    `);

    const newFoo = faker.lorem.word();
    await fillIn('input', newFoo);
    await triggerEvent('input', 'change');

    assert.equal(model.get('foo'), newFoo);
  });

  test('it binds the multiple field values down to the control', async function (assert) {
    const valueOne = faker.lorem.word();
    const valueTwo = faker.lorem.word();
    const valueThree = faker.lorem.word();

    this.model = EmberObject.create({ valueOne, valueTwo, valueThree });

    await render(hbs`
      <FormFor @model={{this.model}} as |f|>
        <f.fieldFor @params={{array "valueOne" "valueTwo" "valueThree"}} />
      </FormFor>
    `);

    assert.dom('input.input-0').hasValue(valueOne);
    assert.dom('input.input-1').hasValue(valueTwo);
    assert.dom('input.input-2').hasValue(valueThree);

    const newValueOne = faker.lorem.word();
    const newValueTwo = faker.lorem.word();
    const newValueThree = faker.lorem.word();

    run(() => {
      this.model.setProperties({
        valueOne: newValueOne,
        valueTwo: newValueTwo,
        valueThree: newValueThree,
      });
    });

    assert.dom('input.input-0').hasValue(newValueOne);
    assert.dom('input.input-1').hasValue(newValueTwo);
    assert.dom('input.input-2').hasValue(newValueThree);
  });

  test('it propagates the multiple changes to the form model', async function (assert) {
    const valueOne = faker.lorem.word();
    const valueTwo = faker.lorem.word();
    const valueThree = faker.lorem.word();

    this.model = EmberObject.create({ valueOne, valueTwo, valueThree });

    await render(hbs`
      <FormFor @model={{this.model}} as |f|>
        <f.fieldFor @params={{array "valueOne" "valueTwo" "valueThree"}} />
      </FormFor>
    `);

    const newFoo = faker.lorem.word();
    await fillIn('input.input-0', newFoo);
    await triggerEvent('input.input-0', 'change');
    assert.equal(this.model.get('valueOne'), newFoo);
  });

  test('it binds the multiple field values down to the control with the mapping ', async function (assert) {
    const foo = faker.lorem.word();
    const bar = faker.lorem.word();
    const baz = faker.lorem.word();

    this.model = EmberObject.create({ foo, bar, baz });

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

    const newValueOne = faker.lorem.word();
    const newValueTwo = faker.lorem.word();
    const newValueThree = faker.lorem.word();

    run(() => {
      this.model.setProperties({
        foo: newValueOne,
        bar: newValueTwo,
        baz: newValueThree,
      });
    });

    assert.dom('input.input-0').hasValue(newValueOne);
    assert.dom('input.input-1').hasValue(newValueTwo);
    assert.dom('input.input-2').hasValue(newValueThree);
  });

  test('it propagates the multiple changes to the form model with the mapping', async function (assert) {
    const foo = faker.lorem.word();
    const bar = faker.lorem.word();
    const baz = faker.lorem.word();

    const model = EmberObject.create({ foo, bar, baz });

    this.set('model', model);

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
    assert.equal(model.get('foo'), newFoo);
  });

  test('it hides the control when inlineEditing', async function (assert) {
    this.model = EmberObject.create({ foo: 'bar' });

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
    this.model = EmberObject.create({ foo: 'bar' });

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
    this.model = EmberObject.create({ foo: 'bar' });

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
    this.model = EmberObject.create({ foo: 'bar', errors: { foo: ['bar'] } });

    await render(hbs`
      <FormFor @model={{this.model}} as |f|>
        <f.fieldFor @params={{array "foo"}} @inlineEditing={{true}} />
      </FormFor>
    `);
    await click('.field-for-value-container');
    assert.dom('input').hasValue('bar');
    await click('button.commit');
    assert.dom('input').hasValue('bar');

    await click('.field-for-value-container');
    assert.dom('input').hasValue('bar');
    await click('button.cancel');
    assert.dom('input').doesNotExist();
    assert.dom('.field-for-value-container').hasText('bar');
  });

  test('it shows the control and the value when inline-editing and has-control-callout and the value is clicked', async function (assert) {
    this.model = EmberObject.create({ foo: 'bar' });

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
      <FormFor this.model @modelName={{this.modelName}} as |f|>
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
    let model = null;

    run(() => {
      model = this.owner.lookup('service:store').createRecord(modelName);
    });

    this.set('model', model);

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
});
