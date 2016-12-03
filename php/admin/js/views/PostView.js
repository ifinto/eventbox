define([
  'marionette',
  'views/LocationAddView',
  'dateformat',
  'jquery-ui',
  'wickedpicker'
], function(Marionette, LocationAddView, dateformat) {
  return Marionette.View.extend({
    template: '#post-item-tpl',

    regions: {
      location: '#location-add-target'
    },

    ui: {
      content:     '[name="content"]',
      date:        '[name="data"]',
      time:        '[name="time"]',
      datepicker:  '#datepicker',
      timepicker:  '#timepicker',
      location:    '#location-input'
    },

    events: {
      'submit form':            'onDefSubmit',
      'click .js-submit-btn':   'onSubmit',
      'click .js-add-location': 'onAddLocation'
    },

    onRender: function () {
      var self = this
      var date = this.model.get('post_date').split(' ')[0]
      var time = this.model.get('post_date').split(' ')[1]
      this.ui.datepicker.datepicker()
      this.ui.datepicker.datepicker('setDate', new Date(date))
      this.ui.timepicker.wickedpicker({
        twentyFour: true,
        now: time
      })
      setTimeout(function () {
        self.ui.timepicker.trigger('click')
      }, 0)
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
      this.ui.location.autocomplete({
        source: locations,
        select: function (event, ui) {
          self.ui.location.val(ui.item.label)
          return false
        }
      })
    },

    updateModel: function () {
      var date = this.ui.datepicker.datepicker('getDate')
      var time = this.ui.timepicker.wickedpicker('time').replace(/\s/g, '')

      this.model.set({
        post_content:  this.ui.content.val(),
        post_location: this.ui.location.val(),
        post_date:     dateformat(date, 'yyyy-mm-dd') +' '+ time
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
        self.renderLocationsInput()
        self.ui.location.val(30)
      })
    },

    templateContext: function () {
      console.log(this.model.get('post_location'))
      var dbDate = this.model.get('post_date')
      var splitted = dbDate && dbDate.split(' ')
      var datePublished = this.model.get('post_source_published')
      datePublished = dateformat(new Date(datePublished), 'mmmm dd')
      if (datePublished == dateformat(new Date())) datePublished += ' Today'

      return {
        date: splitted[0],
        time: splitted[1],
        datePublished: datePublished
      }
    }
  });
});
