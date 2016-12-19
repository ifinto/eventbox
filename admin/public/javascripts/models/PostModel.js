define([
  'backbone',
], function(Backbone) {
  return Backbone.Model.extend({
  	urlRoot: '/api/post',

  	defaults: {
  		post_title: '',
  		post_content: '',
  		post_location: '',
  		post_date_from: '',
  		post_date_to: '',
  		post_time_from: '',
  		post_time_to: '',
  		post_source_url: '',
  		post_images: ''
  	},

  	parse: function (response) {
  		var loc = response.post_location
  		response.post_location = loc == 'null' ? '' : loc
  		return response
  	}
  });
});
