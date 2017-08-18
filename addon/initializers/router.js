export function initialize(/* application */) {
  // application.inject('route', 'foo', 'service:foo');
}

export default {
  name: 'router',
  initialize: function(application) {
    application.inject('component', 'router', 'router:main');
  }
};
