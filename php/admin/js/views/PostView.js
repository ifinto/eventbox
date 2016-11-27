define([
  'marionette',
  'dateformat',
  'jquery-ui',
  'wickedpicker'
], function(Marionette, dateformat) {
  return Marionette.View.extend({
    template: '#post-item-tpl',

    ui: {
      content:     '[name="content"]',
      date:        '[name="data"]',
      time:        '[name="time"]',
      datepicker:  '#datepicker',
      timepicker:  '#timepicker',
      location:    '#location-input'
    },

    events: {
      'submit form':          'onDefSubmit',
      'click .js-submit-btn': 'onSubmit'
    },

    onRender: function () {
      var self = this
      var date = this.model.get('post_date').split(' ')[0]
      var time = this.model.get('post_date').split(' ')[1]
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
      this.ui.datepicker.datepicker()
      this.ui.datepicker.datepicker('setDate', new Date(date))
      this.ui.timepicker.wickedpicker({
        twentyFour: true,
        now: time
      })
      setTimeout(function () {
        self.ui.timepicker.trigger('click')
      }, 0)
    },

    updateModel: function () {
      var date = this.ui.datepicker.datepicker('getDate')
      var time = this.ui.timepicker.wickedpicker('time').replace(/\s/g, '')

      this.model.set({
        post_content:  this.ui.content.val(),
        post_location: this.ui.location.val(),
        post_date:     dateformat(date, 'yyyy-mm-dd') +' '+ time
      })
      console.log(this.model.attributes)
    },

    onSubmit: function (e) {
      var self = this
      var status = $(e.currentTarget).attr('status')
      e.preventDefault()
      this.updateModel()
      this.model.set({post_status: status})
      this.model.save()
      this.model.on('sync', function () {
        self.options.parent.render()
      })
    },

    onDefSubmit: function (e) {
      e.preventDefault()
    },

    templateContext: function () {
      console.log(this.model.get('post_location'))
      var dbDate = this.model.get('post_date')
      var splitted = dbDate && dbDate.split(' ')
      return {
        date: splitted[0],
        time: splitted[1]
      }
    }
  });
});
