import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | form-controls/ff-checkbox', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(hbs`<FormControls::FfCheckbox />`);

    assert
      .dom('[data-test-ff-control-checkbox]')
      .exists({ count: 1 })
      .hasAttribute('type', 'checkbox', 'Should render a checkbox input');
  });
});
