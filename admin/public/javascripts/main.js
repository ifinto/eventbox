require.config({
  paths: {
    app: 'app',
    jquery: 'vendor/jquery-3.1.1',
    'jquery-ui': 'vendor/jquery-ui',
    underscore: 'vendor/underscore',
    'backbone.radio': 'vendor/backbone.radio',
    backbone: 'vendor/backbone',
    marionette: 'vendor/backbone.marionette',
    dateformat: 'vendor/dateformat',
    promise: 'vendor/bluebird.min',
    tinymce: 'vendor/tinymce/dev/tinymce'
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
    tinymce: {
      exports: 'tinymce'
    }
  }
});

require([
  'app'
], function (app) {
  _.templateSettings = {
    evaluate: /\{\{(.+?)\}\}/g,
    interpolate: /\{\{=(.+?)\}\}/g,
    escape: /\{\{-(.+?)\}\}/g
  };
  _.defined = function (el) {
    return !_.isUndefined(el)
  }
  window.App = app
  window.App.start();
});
