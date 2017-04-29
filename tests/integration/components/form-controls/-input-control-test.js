import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('form-controls/-input-control', 'Integration | Component | controls/ input control', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(1);

  this.render(hbs`{{form-controls/-input-control}}`);

  assert.equal(this.$().text().trim(), '');
});
