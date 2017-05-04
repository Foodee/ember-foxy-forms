import {moduleForComponent, test} from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

import faker from 'faker';

moduleForComponent('field-for', 'Integration | Component | field container', {
  integration: true
});

test('it renders', function (assert) {
  assert.expect(0);
});


test('it renders testing classes', function (assert) {

  const key = faker.lorem.word();
  this.set('key', key);

  this.render(hbs`
    {{#form-for as |f|}}
      {{f.field-for key}} 
    {{/form-for}}
  `);

  assert.notEqual(this.$(`.--field-for__${key}`)[0], undefined);
});


test('it delegates the values param to the control', function (assert) {

  const key = faker.lorem.word();
  this.set('key', key);

  this.set('values', [
    {
      id: 1,
      label: faker.lorem.word()
    },
    {
      id: 2,
      label: faker.lorem.word()
    }
  ]);

  this.render(hbs`
    {{#form-for as |f|}}
      {{f.field-for key using='-select' values=values}} 
    {{/form-for}}
  `);

  assert.equal(this.$('option').length, 2);
});


test('it delegates the values param to the control using the string format', function (assert) {

  const key = faker.lorem.word();
  this.set('key', key);

  this.render(hbs`
    {{#form-for as |f|}}
      {{f.field-for key using='-select' values='1:foo,2:bar'}} 
    {{/form-for}}
  `);

  assert.equal(this.$('option').length, 2);
});
