define([
  'marionette',
  'views/FilterPostsPageView'
], function(Marionette, FilterPostsPageView) {
  return Marionette.View.extend({
    template: '#main-tpl',

    regions: {
      content: '.js-content'
    },

    onRender: function () {
      this.showChildView('content', new FilterPostsPageView());
    }
  })
});
