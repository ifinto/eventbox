define([
  'marionette',
  'views/PostView',
  'models/PostModel'
], function(Marionette, PostView, PostModel) {
  return Marionette.View.extend({
	  template: '#filter-posts-page-tpl',

	  regions: {
	    content: '.js-post-content'
	  },

	  onRender: function () {
      var self = this
      var postView = new PostView({
        parent: this
      })
      postView.model = new PostModel()
      postView.model.fetch().then(function (data) {
        self.showChildView('content', postView)
      })
	  }
  });
});
