import Component from '@ember/component';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | errors for', function (hooks) {
  setupRenderingTest(hooks);

  test('displays errors', async function (assert) {
    assert.expect(1);

    this.set('errors', ['some-error', 'another-error']);

    await render(hbs`<ErrorsFor @errors={{this.errors}} />`);

    assert.dom('.error').exists({ count: 2 }, 'should display two errors');
  });

  test('can configure custom error component', async function (assert) {
    assert.expect(2);

    this.owner.register(
      'config:environment',
      {
        APP: {
          'ember-foxy-forms': {
            customErrorComponent: 'custom-errors-for',
          },
        },
      },
      { instantiate: false }
    );

    this.owner.register(
      'component:custom-errors-for',
      Component.extend({
        classNames: ['custom-error'],
      })
    );

    this.errors = ['some-error'];

    await render(
      hbs`<ErrorsFor @errors={{this.errors}} @customErrorComponent="custom-errors-for" />`
    );

    assert.dom('.error').doesNotExist('should not display default error element');
    assert.dom('.custom-error').exists({ count: 1 }, 'should use custom errors-for component');
  });
});
