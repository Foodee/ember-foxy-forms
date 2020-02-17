import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | label-for', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<LabelFor />`);

    assert.equal(this.element.textContent.trim(), '');
  });
});

// import { module, test } from 'qunit';
// import { setupRenderingTest } from 'ember-qunit';
// import { render, findAll } from '@ember/test-helpers';
// import hbs from 'htmlbars-inline-precompile';

// module('Integration | Component | label for', function(hooks) {
//   setupRenderingTest(hooks);

//   test('binds label "for" works', async function(assert) {
//     assert.expect(1);

//     await render(hbs`<LabelFor @controlId="foo" @label="foo" />`);

//     assert.dom('label').hasAttribute('for', 'foo');
//   });

//   test('displays provided label', async function(assert) {
//     assert.expect(1);

//     await render(hbs`<LabelFor @controlId="foo" @label="foo" />`);

//     assert.dom('label').hasText('foo');
//   });

//   test('hides label element when no label defined', async function(assert) {
//     assert.expect(1);

//     await render(hbs`<LabelFor @controlId="foo" />`);

//     assert.strictEqual(findAll('label').length, 0, 'label element should not be present');
//   });
// });
