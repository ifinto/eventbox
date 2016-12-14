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
      timepicker_1:    '#timepicker_1',
      timepicker_2:    '#timepicker_2'
    },

    ui: {
      title:         '[name="title"]',
      content:       '[name="content"]',
      date:          '[name="data"]',
      timepicker_1:  '#timepicker_1',
      timepicker_2:  '#timepicker_2',
      datepicker_1:  '#datepicker_1',
      datepicker_2:  '#datepicker_2',
      locationLabel: '#location-label',
      location:      '[name="location"]'
    },

    events: {
      'submit form':            'onDefSubmit',
      'click .js-submit-btn':   'onSubmit',
      'click .js-submit-btn':   'onSubmit',
      'click .js-toggle-date-range': 'toggleDateRange',
      'click .js-toggle-time-range': 'toggleTimeRange'
    },

    onRender: function () {
      var self = this

      this.dateRange = !!this.model.get('post_date_to')
      this.ui.datepicker_1.datepicker()
      this.ui.datepicker_1.datepicker('setDate', new Date(this.model.get('post_date_from')))
      if (this.dateRange) {
        this.ui.datepicker_2.datepicker()
        this.ui.datepicker_2.datepicker('setDate', new Date(this.model.get('post_date_to')))
      }

      this.timeRange = !!this.model.get('post_time_to')
      this.timepickerView_1 = new TimepickerView({time: this.model.get('post_time_from')})
      this.showChildView('timepicker_1', this.timepickerView_1)
      if (this.timeRange) {
        this.timepickerView_2 = new TimepickerView({time: this.model.get('post_time_to')})
        this.showChildView('timepicker_2', this.timepickerView_2)
      }
      
      this.renderLocationsInput()
    },

    toggleDateRange: function (e) {
      e.preventDefault()
      this.dateRange = !this.dateRange
      $(e.currentTarget).toggleClass('active', this.dateRange)

      if (this.dateRange) {
        this.ui.datepicker_2.datepicker()
      } else {
        this.ui.datepicker_2.datepicker('destroy')
      }
    },

    toggleTimeRange: function (e) {
      e.preventDefault()
      this.timeRange = !this.timeRange
      $(e.currentTarget).toggleClass('active', this.timeRange)

      if (this.timeRange) {
        this.timepickerView_2 = new TimepickerView()
        this.showChildView('timepicker_2', this.timepickerView_2)
      } else {
        this.timepickerView_2.destroy()
      }
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
      if (this.dateRange) {
        var d1 = this.ui.datepicker_1.datepicker('getDate')
        var d2 = this.ui.datepicker_2.datepicker('getDate')
        var date_from = dateformat(Math.min(d1, d2), 'yyyy-mm-dd')
        var date_to   = dateformat(Math.max(d1, d2), 'yyyy-mm-dd')
        var t1 = this.timepickerView_1.getTime()
        var t2 = this.timepickerView_2.getTime()
        var time_from = (t1 < t2 ? t1 : t2)
        var time_to   = (t1 > t2 ? t1 : t2)
      } else {
        var d1 = this.ui.datepicker_1.datepicker('getDate')
        var date_from = dateformat(Math.min(d1, d2), 'yyyy-mm-dd')
        var date_to   = null
        var time_from = this.timepickerView_1.getTime()
        var time_to   = null
      }

      this.model.set({
        post_title:    this.ui.title.val(),
        post_content:  this.ui.content.val(),
        post_location: this.ui.location.val(),
        post_date_from: date_from,
        post_date_to:   date_to,
        post_time_from: time_from,
        post_time_to:   time_to
      })
    },

    onSubmit: function (e) {
      var self = this
      var status = $(e.currentTarget).attr('status')
      e.preventDefault()
      this.updateModel()
      this.model.set({post_status: status})
      this.model.save().then(() => {
        self.options.parent.renderChild()
      })
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

      return {
        datePublished: datePublished,
        sourceUrlRoot: sourceUrlRoot
      }
    }
  });
});
