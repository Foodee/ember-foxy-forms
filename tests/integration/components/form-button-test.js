import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | form button', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`<FormButton />`);

    assert.dom('*').hasText('');

    // Template block usage:
    await render(hbs`
    <FormButton>
    template block text
    </FormButton>
    `);

    assert.dom('[data-test-form-button]').hasText('template block text');
  });
});
