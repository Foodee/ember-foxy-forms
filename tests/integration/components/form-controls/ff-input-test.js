import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | form-controls/ff-input', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(hbs`<FormControls::FfInput />`);

    assert.dom('[data-test-ff-control-input]').exists();
  });

  test('it has a configurable inputType', async function (assert) {
    await render(hbs`<FormControls::FfInput />`);

    assert.dom('input[type=text]').exists();

    await render(hbs`<FormControls::FfInput @inputType="search"/>`);
    assert.dom('input[type=search').exists();
  });
});
