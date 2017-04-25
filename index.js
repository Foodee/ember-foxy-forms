/* jshint node: true */
'use strict';

const TransformFilter = require('./lib/transform-filter');

module.exports = {
  name: 'ember-form-for',

  included(app) {
    this._super.included.apply(this, arguments);

    this.options = {
      targets: [
        {
          pattern: 'components/example-component.hbs',
          transform: (content, originalPath) => {
            return buildYield();
          }
        }
      ],
      extensions: ['hbs']
    };
  },

  treeForAddonTemplates: function (tree) {
    return new TransformFilter(tree, this.options);
  }
};


function buildYield() {
  return '{{yield (hash foo="It works!")}}';
}
