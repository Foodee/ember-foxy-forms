/* jshint node: true */
'use strict';

const TransformFilter = require('./lib/transform-filter');
const fs = require('fs');

module.exports = {
  name: 'ember-form-for',
};

function buildTemplate(controlFileList) {
  const hash = controlFileList.reduce((content, controlFileName) => {
    const controlName = controlFileName.slice(0, -4);
    const keyName = controlName.replace('-control', '');

    return `${content} ${keyName}=(component "field-container" control="controls/${controlName}" form=this commitValue=updateValue)`;
  }, '');

  return `<div class="form">{{yield (hash ${hash})}}</div>`;
}
