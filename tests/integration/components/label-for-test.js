import {moduleForComponent, test} from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('label-for', 'Integration | Component | label for', {
  integration: true
});

test('binds label "for" works', function(assert) {
  assert.expect(1);

  this.render(hbs`{{label-for controlId="foo" label="foo"}}`);

  assert.equal(this.$('label').attr('for'), 'foo');
});

test('displays provided label', function(assert) {
  assert.expect(1);

  this.render(hbs`{{label-for controlId="foo" label="foo"}}`);

  assert.equal(this.$('label').text().trim(), 'foo');
});

test('hides label element when no label defined', function(assert) {
  assert.expect(1);

  this.render(hbs`{{label-for controlId="foo"}}`);

  assert.strictEqual(this.$('label').length, 0, 'label element should not be present');
});
