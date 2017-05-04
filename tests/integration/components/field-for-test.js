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

  const key =  faker.lorem.word();
  this.set('key', key);

  this.render(hbs`
    {{#form-for as |f|}}
      {{f.field-for key}} 
    {{/form-for}}
  `);

  assert.notEqual(this.$(`.--field-for__${key}`)[0], undefined);
});
