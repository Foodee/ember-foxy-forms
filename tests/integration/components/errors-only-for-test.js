import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | errors-only-for', function(hooks) {
  setupRenderingTest(hooks);

  test('renders', async function (assert) {
    this.model = { foo: ''};

    await render(hbs`
      <FormFor @model={{this.model}} as |f|>
        <f.errorOnly @for='foo' />
      </FormFor>
    `);
  });
});
