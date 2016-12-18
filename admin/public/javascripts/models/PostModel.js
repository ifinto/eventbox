define([
  'backbone',
], function(Backbone) {
  return Backbone.Model.extend({
  	urlRoot: '/api/post',
  	
  	idAttribute: 'ID',

  	parse: function (response) {
  		var loc = response.post_location
  		response.post_location = loc == 'null' ? '' : loc
  		return response
  	}
  });
});
