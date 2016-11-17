define([
  'marionette'
], function(Marionette) {
  return Marionette.View.extend({
    template: '#post-item-tpl',

    ui: {
      content: '[name="content"]',
      where:   '[name="where"]',
      date:    '[name="data"]',
      time:    '[name="time"]'
    },

    events: {
      'submit form':              'onDefSubmit',
      'click [action="publish"]': 'publish',
      'click [action="draft"]'  : 'draft',
    	'click [action="delete"]' : 'delete'
    },

    updateModel: function () {
      this.model.set({
        post_content: this.ui.content.val(),
        post_location: this.ui.where.val(),
        post_date:    this.ui.date.val() +' '+ this.ui.time.val()
      })
    },

    publish: function (e) {
      e.preventDefault()
      this.updateModel()
      this.model.save({'post_status': 'published'})
      this.options.parent.render()
    },

    draft: function (e) {
      e.preventDefault()
      this.updateModel()
      this.model.save({'post_status': 'draft'})
      this.options.parent.render()
    },

    delete: function (e) {
      e.preventDefault()
      this.model.destroy({
        url: this.model.url +'?ID='+ this.model.get('ID')
      })
      this.options.parent.render()
    },

    onDefSubmit: function (e) {
      e.preventDefault()
    },

    templateContext: function () {
      var dbDate = this.model.get('post_date')
      var splitted = dbDate && dbDate.split(' ')
      return {
        date: splitted[0],
        time: splitted[1]
      }
    }
  });
});
