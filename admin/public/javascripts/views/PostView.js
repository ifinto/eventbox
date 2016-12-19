define([
  'marionette',
  'views/LocationAddView',
  'views/TimepickerView',
  'views/PostImagesView',
  'dateformat',
  'tinymce',
  'jquery-ui'
], function(Marionette, LocationAddView, TimepickerView, PostImagesView, dateformat, tinymce) {
  return Marionette.View.extend({
    template: '#post-item-tpl',

    regions: {
      location: '#location-add-target',
      timepicker_1:    '#timepicker_1',
      timepicker_2:    '#timepicker_2',
      post_images:     '#post_images'
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
      'submit form':              'onDefSubmit',
      'click .js-save-btn':       'onSave',
      'click .js-submit-btn':     'onSubmit',
      'click .js-add-location':   'onAddLocation',
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
      this.showChildView('post_images', new PostImagesView({
        imagesArr: this.model.get('post_images')
      }))

      setTimeout(this.renderTinymce.bind(this), 0)
    },

    renderTinymce: function () {
      tinymce.init({
        target: this.ui.content[0],
        height: 400,
        menubar: false,
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table contextmenu paste code'
        ],
        toolbar: 'undo redo | styleselect | bold italic | link image'
      });
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
          value: loc.get('id')
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
        var foundLocation = self.options.locations.findWhere({id: currentLocation})
        if (foundLocation) {
          this.ui.location.val(foundLocation.get('id'))
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
      } else {
        var d1 = this.ui.datepicker_1.datepicker('getDate')
        var date_from = dateformat(Math.min(d1, d2), 'yyyy-mm-dd')
        var date_to   = ''
      }

      if (this.timeRange) {
        var t1 = this.timepickerView_1.getTime()
        var t2 = this.timepickerView_2.getTime()
        var time_from = (t1 < t2 ? t1 : t2)
        var time_to   = (t1 > t2 ? t1 : t2)
      } else {
        var time_from = this.timepickerView_1.getTime()
        var time_to   = ''
      }

      var post_content = tinymce.get('content').getContent()

      this.model.set({
        post_title:    this.ui.title.val(),
        post_content:  post_content,
        post_location: this.ui.location.val(),
        post_date_from: date_from,
        post_date_to:   date_to,
        post_time_from: time_from,
        post_time_to:   time_to
      })
    },

    onSave: function (e) {
      var self = this
      e.preventDefault()
      this.updateModel()
      this.model.save().then(() => {
        self.options.postUpdated()
      })
    },

    onSubmit: function (e) {
      var self = this
      var status = $(e.currentTarget).attr('status')
      e.preventDefault()
      this.updateModel()
      this.model.set({post_status: status})
      this.model.save().then(() => {
        self.options.postUpdated()
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
        self.model.set({post_location: model.get('id')})
        self.renderLocationsInput()
        locationAddView.destroy()
      })
    },

    templateContext: function () {
      var post_source_published = this.model.get('post_source_published') || null
      var datePublished = new Date(post_source_published)
      if (datePublished.getTime()) {
        datePublished = dateformat(new Date(datePublished), 'mmmm dd')
        if (datePublished == dateformat(new Date())) datePublished += ' Today'
      } else {
        datePublished = ''
      }

      var post_source_url = this.model.get('post_source_url')
      var sourceUrlRoot = post_source_url ? post_source_url.split('?')[0] : ''

      return {
        datePublished: datePublished,
        sourceUrlRoot: sourceUrlRoot,
        post_title_class: this.model.get('post_title') === '' ? 'has-error' : '',
        postId: this.model.id || false
      }
    },

    onDestroy: function () {
      tinymce.remove()
    }
  });
});
