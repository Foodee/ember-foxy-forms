import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('commit-buttons', 'Integration | Component | commit buttons', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{commit-buttons}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#commit-buttons}}
      template block text
    {{/commit-buttons}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
