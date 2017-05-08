import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('errors-for', 'Integration | Component | errors for', {
  integration: true
});

test('displays errors', function(assert) {
  assert.expect(1);

  this.set('errors', ['some-error', 'another-error']);

  this.render(hbs`{{errors-for errors=errors}}`);

  assert.equal(this.$('.error').length, 2, 'should display two errors');
});

test('can configure custom error component', function (assert) {
  assert.expect(2);

  this.register('config:environment', {
    APP: {
      'ember-foxy-forms': {
        customErrorComponent: 'custom-errors-for'
      }
    }
  }, {instantiate: false});

  this.register('component:custom-errors-for', Ember.Component.extend({
    classNames: ['custom-error']
  }));

  this.set('errors', ['some-error']);

  this.render(hbs`{{errors-for errors=errors}}`);

  assert.equal(this.$('.error').length, 0, 'should not display default error element');
  assert.equal(this.$('.custom-error').length, 1, 'should use custom errors-for component');
});
