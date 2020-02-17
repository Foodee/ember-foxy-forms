import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, findAll } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import faker from 'faker';

module('Integration | Component | field container', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', function(assert) {
    assert.expect(0);
  });

  test('it renders testing classes', async function(assert) {
    this.key = faker.lorem.word();

    await render(hbs`
      <FormFor as |form|>
        <form.fieldFor @params={{array this.key}} />
      </FormFor>
    `);

    assert.notEqual(findAll(`.--field-for__object_${this.key}`)[0], undefined);
  });

  test('it delegates the values param to the control', async function(assert) {
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
          @using="-select"
          @values={{this.values}}
        />
      </FormFor>
    `);

    assert.dom('[data-test-form-controls-selector-option]').exists({ count: 2 });
  });

  test('it delegates the values param to the control using the string format', async function(assert) {
    this.key = faker.lorem.word();

    await render(hbs`
      <FormFor as |form|>
        <form.fieldFor
          @params={{array this.key}}
          @using="-select"
          @values="1:foo,2:bar"
        />
      </FormFor>
    `);

    assert.dom('[data-test-form-controls-selector-option]').exists({ count: 2 });
  });
});
