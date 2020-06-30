import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | form-controls/ff-input', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(hbs`<FormControls::FfInput />`);

    assert.dom('[data-test-ff-control-input]').exists({ count: 1 });
  });

  test('it has a configurable inputType', async function (assert) {
    await render(hbs`<FormControls::FfInput @inputType="search"/>`);

    assert
      .dom('[data-test-ff-control-input]')
      .exists({ count: 1 })
      .hasAttribute('type', 'search', 'Should render a search input');
  });
});
