define([
	'marionette',
  'views/MainView'
], function(Marionette, MainView) {
  return Marionette.Application.extend({
    region: '#app-root',

    onStart: function() {
      var mainView = new MainView()
      this.showView(mainView)
    }
  });
});
