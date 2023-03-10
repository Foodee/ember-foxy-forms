import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | form-controls/ff-radio', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(hbs`<FormControls::FfRadio @values={{array (hash id="1")}} />`);

    assert
      .dom('[data-test-ff-control-radio]')
      .exists({ count: 1 })
      .hasAttribute('type', 'radio', 'Should render a radio input');
  });
});
