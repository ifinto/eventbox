define([
  'marionette',
], function(Marionette) {
  var ChildView = Marionette.View.extend({
    template: '#post-image-tpl',

    tagName: 'li'
  }) 

  return Marionette.CollectionView.extend({
    childView: ChildView,

    tagName: 'ul',

    initialize: function (opts) {
      var images = !!opts.imagesArr ? JSON.parse(opts.imagesArr) : []
      var imagesArr = images.map(function (img) {
        return {src: img}
      })
      this.collection = new Backbone.Collection(imagesArr)
    }
  });
});
