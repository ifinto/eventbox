define([
  'marionette',
  'models/LocationModel'
], function(Marionette, LocationModel) {
  return Marionette.View.extend({
    template: '#location-add-tpl',

    ui: {
      title:       '[name="title"]',
      description: '[name="description"]',
      address:     '[name="address"]'
    },

    events: {
      'submit form': 'onSubmit'
    },

    initialize: function () {
      this.model = new LocationModel()
    },

    onSubmit: function (e) {
      e.preventDefault()
      var x = this.model.save({
        title:       this.ui.title.val(),
        description: this.ui.description.val(),
        address:     this.ui.address.val()
      }).done(function () {
        console.log('done')
      })
    }
  });
});
