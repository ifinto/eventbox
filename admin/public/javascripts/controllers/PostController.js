define([
  'marionette',
  'app',
  'models/PostModel',
  'collections/LocationsCollection',
  'views/PostView',
	'views/PostNotFoundView',
  'promise',
  'helpers/parseQueryString'
], function (
  Marionette, 
  app,
  PostModel,
  LocationsCollection,
  PostView,
  PostNotFoundView,
  Promise,
  parseQueryString
) {
  return Marionette.Object.extend({
    getPostById: function (id) {
      var self = this
      var postView = new PostView()
      postView.model = new PostModel({ID: id})
      postView.options.locations = new LocationsCollection()

      Promise.mapSeries([postView.model, postView.options.locations], function (model) {
        return model.fetch()
      }).then(function () {
        window.App.showView(new PostNotFoundView())
      })
    },

    getPost: function (query) {
      var params = parseQueryString(query)
      var post_status = (params && params.post_status) || 'new'
      var self = this
      var postView = new PostView()
      postView.model = new PostModel()
      postView.options.locations = new LocationsCollection()

      Promise.all([
        postView.model.fetch({ data: { post_status: post_status } }),
        postView.options.locations.fetch()
      ]).then(function () {
        if (postView.model.id != null) {
          window.App.showView(postView)
        } else {
          window.App.showView(new PostNotFoundView())
        }
      })
    }
  })
})