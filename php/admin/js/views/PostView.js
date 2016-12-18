define([
  'marionette',
  'views/LocationAddView',
  'views/TimepickerView',
  'dateformat',
  'jquery-ui',
  'wickedpicker'
], function(Marionette, LocationAddView, TimepickerView, dateformat) {
  return Marionette.View.extend({
    template: '#post-item-tpl',

    regions: {
      location: '#location-add-target',
      timepicker:    '#timepicker'
    },

    ui: {
      content:       '[name="content"]',
      date:          '[name="data"]',
      time:          '[name="time"]',
      datepicker:    '#datepicker',
      locationLabel: '#location-label',
      location:      '[name="location"]'
    },

    events: {
      'submit form':            'onDefSubmit',
      'click .js-submit-btn':   'onSubmit',
      'click .js-add-location': 'onAddLocation'
    },

    onRender: function () {
      var self = this
      var date = this.model.get('post_date')
      var time = this.model.get('post_time')
      this.ui.datepicker.datepicker()
      this.ui.datepicker.datepicker('setDate', new Date(date))

      this.timepickerView = new TimepickerView({time: time})
      this.showChildView('timepicker', this.timepickerView)
      this.renderLocationsInput()
    },

    renderLocationsInput: function () {
      var self = this
      var locations = self.options.locations.map(function (loc) {
        return {
          label: loc.get('title'),
          value: loc.get('ID')
        }
      })
      var currentLocation = this.model.get('post_location')
      this.ui.locationLabel.autocomplete({
        source: locations,
        select: function (event, ui) {
          self.ui.location.val(ui.item.value)
          self.ui.locationLabel.val(ui.item.label)
          return false
        }
      })
      if (!!currentLocation) {
        var foundLocation = self.options.locations.findWhere({ID: currentLocation})
        if (foundLocation) {
          this.ui.location.val(foundLocation.get('ID'))
          this.ui.locationLabel.val(foundLocation.get('title'))
        }
      }
    },

    updateModel: function () {
      var date = this.ui.datepicker.datepicker('getDate')
      var time = this.timepickerView.getTime()

      this.model.set({
        post_content:  this.ui.content.val(),
        post_location: this.ui.location.val(),
        post_date:     dateformat(date, 'yyyy-mm-dd'),
        post_time:     time
      })
    },

    onSubmit: function (e) {
      var self = this
      var status = $(e.currentTarget).attr('status')
      e.preventDefault()
      this.updateModel()
      this.model.set({post_status: status})
      this.model.save()
      this.options.parent.renderChild()
    },

    onDefSubmit: function (e) {
      e.preventDefault()
    },

    onAddLocation: function () {
      var self = this
      var locationAddView = new LocationAddView()
      this.showChildView('location', locationAddView)
      locationAddView.model.on('sync', function (model) {
        self.options.locations.add(model)
        self.model.set({post_location: model.get('ID')})
        self.renderLocationsInput()
        locationAddView.destroy()
      })
    },

    templateContext: function () {
      var datePublished = new Date(this.model.get('post_source_published'))
      if (datePublished.getTime()) {
        datePublished = dateformat(new Date(datePublished), 'mmmm dd')
        if (datePublished == dateformat(new Date())) datePublished += ' Today'
      } else {
        datePublished = ''
      }

      var sourceUrlRoot = this.model.get('post_source_url').split('?')[0]
      var images

      try {
        images = JSON.parse(post.images)
      } catch (err) {
        console.error(err)
        images = []
      }

      return {
        datePublished: datePublished,
        sourceUrlRoot: sourceUrlRoot,
        images: images
      }
    }
  });
});
