define([
  'marionette',
  'app',
  'models/PostModel',
  'collections/LocationsCollection',
  'views/FilterPostsPageView',
	'views/PostNotFoundView',
  'promise',
  'helpers/parseQueryString'
], function (
  Marionette, 
  app,
  PostModel,
  LocationsCollection,
  FilterPostsPageView,
  PostNotFoundView,
  Promise,
  parseQueryString
) {
  return Marionette.Object.extend({
    getPost: function (query) {
      var params = parseQueryString(query)
      var post_status = (params && params.post_status) || 'new'
      var postModel = new PostModel()
      var locationsCollection = new LocationsCollection()

      Promise.all([
        postModel.fetch({data: params}),
        locationsCollection.fetch()
      ]).then(function () {
        window.App.showView(new FilterPostsPageView({
          model: new Backbone.Model({post_status: post_status}),
          post_status: post_status,
          postModel: postModel,
          locations: locationsCollection
        }))
      })
    }
  })
})