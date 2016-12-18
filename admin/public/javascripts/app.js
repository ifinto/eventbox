define([
  'backbone',
  'marionette',
  'Router'
], function(Backbone, Marionette, Router) {
  var App = Marionette.Application.extend({
    region: '#app-root',

    onStart: function() {
      this.router = new Router()
      Backbone.history.start({pushState: true})
    }
  });
  return new App()
});
