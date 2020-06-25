import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | form-for', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let service = this.owner.lookup('service:form-for');
    assert.ok(service);
  });

  test('exposes confirmDestroy / notifySuccess / notifyError', function (assert) {
    let service = this.owner.lookup('service:form-for');
    assert.ok(service.confirmDestroy);
    assert.ok(service.notifySuccess);
    assert.ok(service.notifyError);
  });
});
