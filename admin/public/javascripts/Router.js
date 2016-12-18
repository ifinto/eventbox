define([
  'marionette',
  'controllers/PostController'
], function (Marionette, PostController) {
  return Marionette.AppRouter.extend({
    appRoutes: {
      'post(?*query)': 'getPost'
    },

    controller: new PostController()
  })
})