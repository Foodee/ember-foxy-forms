import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('commit-buttons', 'Integration | Component | commit buttons', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(1);

  this.render(hbs`{{form-controls/-input-control}}`);

  assert.equal(this.$().text().trim(), '');
});
