import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import sinon from 'sinon';

module('Integration | Component | commit-buttons', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(hbs`<CommitButtons @visible={{true}} />`);

    assert.dom('[data-test-commit-buttons]').exists();
  });

  test('component with two buttons that issue commit/cancel events', async function (assert) {
    this.commit = sinon.spy();
    this.cancel = sinon.spy();

    await render(
      hbs`<CommitButtons @visible={{true}} @commit={{this.commit}} @cancel={{this.cancel}} />`
    );

    assert.dom('[data-test-commit-buttons]').exists();

    await click('[data-test-commit-buttons-commit]');
    assert.ok(this.commit.calledOnce);

    await click('[data-test-commit-buttons-cancel]');
    assert.ok(this.cancel.calledOnce);
  });
});
