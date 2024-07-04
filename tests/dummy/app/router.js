import AddonDocsRouter, { docsRoute } from 'ember-cli-addon-docs/router';

import config from 'dummy/config/environment';

export default class Router extends AddonDocsRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  docsRoute(this, function () {
    this.route('usage');
    this.route('forms');
    this.route('fields');
    this.route('controls');
    this.route('advanced');
  });

  this.route('not-found', { path: '/*path' });
});
