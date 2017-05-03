import {moduleForComponent, test} from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

import faker from 'faker';

moduleForComponent('form-for', 'Integration | Component | form for', {
  integration: true
});

test('it renders', function (assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{form-for}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#form-for}}
      template block text
    {{/form-for}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});


test('it binds the field value down to the control', function (assert) {

  const foo = faker.lorem.word();

  const model = Ember.Object.create({
    foo: foo
  });

  this.set('model', model);

  this.render(hbs`
    {{#form-for model as |f|}}
      {{f.field-for 'foo' }} 
    {{/form-for}}
  `);

  assert.equal(this.$('input').val(), foo);

  const newFoo = faker.lorem.word();


  Ember.run(() => {
    model.set('foo', newFoo);
  });
  assert.equal(this.$('input').val(), newFoo);
});


test('it propagates changes to the form model', function (assert) {

  const foo = faker.lorem.word();

  const model = Ember.Object.create({
    foo: foo
  });

  this.set('model', model);

  this.render(hbs`
    {{#form-for model as |f|}}
      {{f.field-for 'foo' }} 
    {{/form-for}}
  `);

  const newFoo = faker.lorem.word();
  this.$('input').val(newFoo);
  this.$('input').change();

  assert.equal(model.get('foo'), newFoo);

});


test('it binds the multiple field values down to the control', function (assert) {

  const valueOne = faker.lorem.word();
  const valueTwo = faker.lorem.word();
  const valueThree = faker.lorem.word();

  const model = Ember.Object.create({valueOne, valueTwo, valueThree});

  this.set('model', model);

  this.render(hbs`
    {{#form-for model as |f|}}
      {{f.field-for 'valueOne' 'valueTwo' 'valueThree' }} 
    {{/form-for}}
  `);

  assert.equal(this.$('input.input-0').val(), valueOne);
  assert.equal(this.$('input.input-1').val(), valueTwo);
  assert.equal(this.$('input.input-2').val(), valueThree);


  const newValueOne = faker.lorem.word();
  const newValueTwo = faker.lorem.word();
  const newValueThree = faker.lorem.word();

  Ember.run(() => {
    model.setProperties({
      valueOne: newValueOne,
      valueTwo: newValueTwo,
      valueThree: newValueThree
    });
  });

  assert.equal(this.$('input.input-0').val(), newValueOne);
  assert.equal(this.$('input.input-1').val(), newValueTwo);
  assert.equal(this.$('input.input-2').val(), newValueThree);
});


test('it propagates the multiple changes to the form model', function (assert) {

  const valueOne = faker.lorem.word();
  const valueTwo = faker.lorem.word();
  const valueThree = faker.lorem.word();

  const model = Ember.Object.create({valueOne, valueTwo, valueThree});

  this.set('model', model);

  this.render(hbs`
    {{#form-for model as |f|}}
      {{f.field-for 'valueOne' 'valueTwo' 'valueThree' }} 
    {{/form-for}}
  `);

  const newFoo = faker.lorem.word();
  this.$('input.input-0').val(newFoo);
  this.$('input.input-0').change();
  assert.equal(model.get('valueOne'), newFoo);
});

test('it binds the multiple field values down to the control with the mapping ', function (assert) {

  const foo = faker.lorem.word();
  const bar = faker.lorem.word();
  const baz = faker.lorem.word();

  const model = Ember.Object.create({foo, bar, baz});

  this.set('model', model);

  this.render(hbs`
    {{#form-for model as |f|}}
      {{f.field-for 'foo' 'bar' 'baz' with-mapping=(hash foo='valueOne' bar='valueTwo' baz='valueThree')}} 
    {{/form-for}}
  `);

  assert.equal(this.$('input.input-0').val(), foo);
  assert.equal(this.$('input.input-1').val(), bar);
  assert.equal(this.$('input.input-2').val(), baz);

  const newValueOne = faker.lorem.word();
  const newValueTwo = faker.lorem.word();
  const newValueThree = faker.lorem.word();

  Ember.run(() => {
    model.setProperties({
      foo: newValueOne,
      bar: newValueTwo,
      baz: newValueThree
    });
  });

  assert.equal(this.$('input.input-0').val(), newValueOne);
  assert.equal(this.$('input.input-1').val(), newValueTwo);
  assert.equal(this.$('input.input-2').val(), newValueThree);

});

test('it propagates the multiple changes to the form model with the mapping', function (assert) {

  const foo = faker.lorem.word();
  const bar = faker.lorem.word();
  const baz = faker.lorem.word();

  const model = Ember.Object.create({foo, bar, baz});

  this.set('model', model);

  this.render(hbs`
    {{#form-for model as |f|}}
      {{f.field-for 'foo' 'bar' 'baz' with-mapping=(hash foo='valueOne' bar='valueTwo' baz='valueThree')}} 
    {{/form-for}}
  `);

  const newFoo = faker.lorem.word();
  this.$('input.input-0').val(newFoo);
  this.$('input.input-0').change();
  assert.equal(model.get('foo'), newFoo);
});


test('it hides the control when inline-editing', function (assert) {

  const model = Ember.Object.create({foo: 'bar'});

  this.set('model', model);

  this.render(hbs`
    {{#form-for model as |f|}}
      {{f.field-for 'foo' inline-editing=true}} 
    {{/form-for}}
  `);

  assert.equal(this.$('input')[0], undefined);
});

test('it shows the control and hides the value when inline-editing and the value is clicked', function (assert) {

  const model = Ember.Object.create({foo: 'bar'});

  this.set('model', model);

  this.render(hbs`
    {{#form-for model as |f|}}
      {{f.field-for 'foo' inline-editing=true}} 
    {{/form-for}}
  `);

  this.$('.field-for-value-container').click();

  assert.equal(this.$('input').val(), 'bar');
  assert.equal(this.$('.field-for-value-container')[0], undefined);
});

test('it hides the control inline-editing when commited or canceled with no errors', function (assert) {
  const model = Ember.Object.create({foo: 'bar'});

  this.set('model', model);

  this.render(hbs`
    {{#form-for model as |f|}}
      {{f.field-for 'foo' inline-editing=true}} 
    {{/form-for}}
  `);

  this.$('.field-for-value-container').click();
  assert.equal(this.$('input').val(), 'bar');
  this.$('button.commit').click();
  assert.equal(this.$('input')[0], undefined);


  this.$('.field-for-value-container').click();
  assert.equal(this.$('input').val(), 'bar');
  this.$('button.cancel').click();
  assert.equal(this.$('input')[0], undefined);
});


test('it does not hide the control when inline-editing when there are errors', function (assert) {
  const model = Ember.Object.create({foo: 'bar', errors: {foo: ['bar']}});

  this.set('model', model);

  this.render(hbs`
    {{#form-for model as |f|}}
      {{f.field-for 'foo' inline-editing=true}} 
    {{/form-for}}
  `);

  this.$('.field-for-value-container').click();
  assert.equal(this.$('input').val(), 'bar');
  this.$('button.commit').click();
  assert.equal(this.$('input').val(), 'bar');


  this.$('.field-for-value-container').click();
  assert.equal(this.$('input').val(), 'bar');
  this.$('button.cancel').click();
  assert.equal(this.$('input').val(), 'bar');
});

test('it shows the control and the value when inline-editing and has-control-callout and the value is clicked', function (assert) {

  const model = Ember.Object.create({foo: 'bar'});

  this.set('model', model);

  this.render(hbs`
    {{#form-for model as |f|}}
      {{f.field-for 'foo' inline-editing=true has-control-callout=true}} 
    {{/form-for}}
  `);

  this.$('.field-for-value-container').click();

  assert.equal(this.$('input').val(), 'bar');
  assert.notEqual(this.$('.field-for-value-container')[0], undefined);
});


