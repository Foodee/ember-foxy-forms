import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('form-controls/-multiple-input-control', 'Integration | Component | form controls/multiple input control', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{form-controls/-multiple-input-control}}`);

  assert.equal(this.$().text().trim(), '');
});
