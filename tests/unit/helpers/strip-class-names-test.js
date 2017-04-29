import {stripClassNames} from 'dummy/helpers/strip-class-names';
import {module, test} from 'qunit';

module('Unit | Helper | strip class names');

test('handles empty classNames array', function(assert) {
  assert.expect(1);

  let result = stripClassNames([[]]);

  assert.strictEqual(result, '', 'empty array should become the empty string');
});

test('handles absent classNames array', function(assert) {
  assert.expect(1);

  let result = stripClassNames([]);

  assert.strictEqual(result, '', 'empty classNames should become the empty string');
});

test('removes ember-view class name from classNames array', function(assert) {
  assert.expect(1);

  let result = stripClassNames([['ember-view', 'another-class']]);

  assert.strictEqual(result, 'another-class', 'ember-view class should have been removed');
});

test('removes ember-view class name from comma delimited string', function(assert) {
  assert.expect(1);

  let result = stripClassNames(['ember-view, another-class']);

  assert.strictEqual(result, 'another-class', 'ember-view class should have been removed');
});
