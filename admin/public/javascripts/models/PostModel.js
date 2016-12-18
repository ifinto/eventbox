define([
  'backbone',
], function(Backbone) {
  return Backbone.Model.extend({
  	urlRoot: '/api/post',

  	parse: function (response) {
  		var loc = response.post_location
  		response.post_location = loc == 'null' ? '' : loc
  		return response
  	}
  });
});
