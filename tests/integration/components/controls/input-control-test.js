import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('controls/input-control', 'Integration | Component | controls/input control', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{controls/input-control}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#controls/input-control}}
      template block text
    {{/controls/input-control}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
