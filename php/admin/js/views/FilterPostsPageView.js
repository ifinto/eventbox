define([
  'marionette',
  'views/PostView',
  'views/PostNotFoundView',
  'models/PostModel',
  'collections/LocationsCollection',
], function(Marionette, PostView, PostNotFoundView, PostModel, LocationsCollection) {
  return Marionette.View.extend({
	  template: '#filter-posts-page-tpl',

	  regions: {
	    content: '.js-post-content'
	  },

    ui: {
      post_status: '#post_status'
    },

    events: {
      'change @ui.post_status': 'onStatusChanged'
    },

    initialize: function () {
      this.postView = new PostView({
        parent: this,
        locations: new LocationsCollection()
      })
      this.postView.model = new PostModel()
    },

	  onRender: function () {
      this.renderChild()
	  },

    onStatusChanged: function () {
      this.renderChild()
    },

    renderChild: function () {
      var self = this
      var post_status = this.ui.post_status.val()

      this.postView.options.locations.fetch().then(function () {
        self.postView.model.fetch({
          data: {
            post_status: post_status
          }
        }).then(function (data) {
          if (!data.ID) {
            self.showChildView('content', new PostNotFoundView)
          } else {
            self.showChildView('content', self.postView)
          }
        })
      })
    }
  });
});
