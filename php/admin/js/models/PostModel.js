define([
  'backbone',
], function(Backbone) {
  return Backbone.Model.extend({
  	url: 'api/post.php',
  	
  	idAttribute: 'ID',
  });
});
