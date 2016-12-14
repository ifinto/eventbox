define([
  'marionette'
], function(Marionette) {
  return Marionette.View.extend({
    template: '#timepicker-tpl',

    ui: {
      hours: '[name="hours"]',
      mins:  '[name="mins"]'
    },

    events: {
      'click .js-hours-up':   'hoursUp',
      'click .js-hours-down': 'hoursDown',
      'click .js-mins-up':    'minsUp',
      'click .js-mins-down':  'minsDown'
    },

    getTime: function () {
      var hours = this.ui.hours.val()
      var mins  = this.ui.mins.val()
      return hours + ':' + mins
    },

    hoursUp: function () {
      var val = parseInt(this.ui.hours.val())
      var newVal = val >= 23 ? 0 : val + 1
      this.ui.hours.val(this.oo(newVal))
    },

    hoursDown: function () {
      var val = parseInt(this.ui.hours.val())
      var newVal = val <= 0 ? 23 : val - 1
      this.ui.hours.val(this.oo(newVal))
    },

    minsUp: function () {
      var val = parseInt(this.ui.mins.val())
      var newVal = val >= 59 ? 0 : val + 1
      this.ui.mins.val(this.oo(newVal))
    },

    minsDown: function () {
      var val = parseInt(this.ui.mins.val())
      var newVal = val <= 0 ? 59 : val - 1
      this.ui.mins.val(this.oo(newVal))
    },

    templateContext: function () {
      var time = this.options.time || '18:00' 
      var split = time.split(':')
      return {
        hours: this.oo(split[0]),
        mins:  this.oo(split[1])
      }
    },

    oo: function (val) {
      var _val = parseInt(val)
      return _val < 10 ? '0'+ _val : _val.toString()
    }
  });
});
