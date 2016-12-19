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
      post_status: '#post_status',
      postIdInput: '#post-id-input',
      postIdSubmit: '#post-id-submit'
    },

    events: {
      'change @ui.post_status': 'onStatusChanged',
      'click .js-prev-post': 'onPrevPost',
      'click .js-next-post': 'onNextPost',
      'click .js-new-post' : 'onNewPost',
      'click @ui.postIdSubmit': 'onPostIdSubmit'
    },

    onRender: function () {
      if (_.isNull(this.options.postModel.id)) {
        this.showChildView('content', new PostNotFoundView)
      } else {
        var postView = new PostView({
          locations: this.options.locations,
          postUpdated: this.postUpdated.bind(this)
        })
        postView.model = this.options.postModel
        this.showChildView('content', postView)
      }

      var post_status = this.model.get('post_status') || 'new'
      this.ui.post_status.val(post_status)
    },

    postUpdated: function () {
      this.onNextPost() 
    },

    onNewPost: function () {
      Backbone.history.navigate('/post/new', {trigger: true})
    },

    onPrevPost: function () {
      var self = this
      var currentId = this.options.postModel.id
      var model = this.options.postModel = new PostModel()
      var status = this.ui.post_status.val()

      model.fetch({
        data: {
          before: currentId,
          post_status: status
        }
      }).then(function () {
        self.render()
      })
    },

    onNextPost: function () {
      var self = this
      var currentId = this.options.postModel.id
      var model = this.options.postModel = new PostModel()
      var status = this.ui.post_status.val()

      model.fetch({
        data: {
          after: currentId,
          post_status: status
        }
      }).then(function () {
        self.render()
      })
    },

    onPostIdSubmit: function () {
      var id = this.ui.postIdInput.val()
      Backbone.history.navigate('/post?id=' + id, {trigger: true})
    },

    onStatusChanged: function () {
      val = this.ui.post_status.val()
      Backbone.history.navigate('/post?post_status=' + val, {trigger: true})
    }
  });
});
