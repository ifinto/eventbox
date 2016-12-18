define([
  'marionette',
  'controllers/PostController'
], function (Marionette, PostController) {
  return Marionette.AppRouter.extend({
    appRoutes: {
      'post(?*query)': 'getPost',
      'post/:id': 'getPostById'
    },

    controller: new PostController()
  })
})