'use strict';

const path      = require('path');
const minimatch = require('minimatch');
const Filter    = require('broccoli-filter');

const PATTERN = 'pattern';
const RENAME = 'rename';
const TRANSFORM = 'transform';

class TransformFilter extends Filter {
  constructor(tree, options) {
    super(tree, options);

    this._extensions = options.extensions;
    this._targets = options.targets;
  }

  canProcessFile(relativePath) {
    _debug(relativePath);
    _debug('#canProcessFile - test `%s`', relativePath);
    const extension = path.extname(relativePath).substr(1);
    if (this._extensions.indexOf(extension) !== -1) {
      return !!this._getApplicableTargets(relativePath).length;
    }
  }

  getDestFilePath(relativePath) {
    const transforms = this._getPathTransforms(relativePath);
    _debug('#getDestFilePath - applying %d transforms to `%s`', transforms.length, relativePath);
    return transforms.reduce((s, transform) => transform(s), relativePath);
  }

  processString(content, relativePath) {
    _debug(relativePath);
    const transforms = this._getContentTransforms(relativePath);
    _debug('#processString - applying %d transforms to `%s`:', transforms.length, relativePath);
    return transforms.reduce((s, transform) => transform(s, relativePath), content);
  }

  _getApplicableTargets(filepath) {
    return this._targets.filter(t => minimatch(filepath, t[PATTERN]));
  }

  _getContentTransforms(filepath) {
    return this._getApplicableTargets(filepath)
        .map(t => t[TRANSFORM])
        .filter(fn => fn);
  }

  _getPathTransforms(filepath) {
    return this._getApplicableTargets(filepath)
        .map(t => t[RENAME])
        .filter(fn => fn);
  }
}

module.exports = TransformFilter;

///
/// Internal API
///

function _debug() {
    console.log.apply(console, arguments);
}
