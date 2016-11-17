require.config({
  paths: {
    app: 'app',
    jquery: 'vendor/jquery-2.2.4',
    'jquery-ui': 'vendor/jquery-ui',
    underscore: 'vendor/underscore',
    'backbone.radio': 'vendor/backbone.radio',
    backbone: 'vendor/backbone',
    marionette: 'vendor/backbone.marionette'
  },
  shim: {
    app: {
      deps: ['jquery', 'underscore', 'backbone'],
      exports: 'app'
    },
    backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    jquery: {
      exports: '$'
    },
    marionette: {
      "deps": ['backbone', 'backbone.radio'],
      "exports": 'Backbone.Marionette'
    },
    underscore: {
      exports: '_'
    },
    'jquery-ui': ['jquery']
  }
});

require([
  'app'
], function (App) {
  _.templateSettings = {
    interpolate: /\{\{(.+?)\}\}/g
  };
  window.App = new App();
  window.App.start();
});
