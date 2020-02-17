import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import faker from 'faker';

module('Integration | Component | form-controls/ff-custom-display-value', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders when its provided as a value for a form', async function (assert) {
    this.object = {
      test: faker.lorem.word(),
    };

    // Template block usage:
    await render(hbs`
        <Form @for={{this.object}} @inlineEditing={{true}} as |f|>
          <f.field @for="test" @displayValueComponent="form-controls/ff-custom-display-value" />
        </Form>`);

    assert.dom('[data-test-form-controls-custom-display-value]').exists();
    assert
      .dom('[data-test-form-controls-custom-display-value]')
      .hasText(`Custom Value Click me to edit: ${this.object.test}`);
  });
});
