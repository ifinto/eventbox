define([
  'underscore'
], function (_) {
  return function (queryString) {
    if (!_.isString(queryString))
      return
    queryString = queryString.substring( queryString.indexOf('?') + 1 )
    var params = {}
    var queryParts = decodeURI(queryString).split(/&/g)
    _.each(queryParts, function(val) {
      var parts = val.split('=')
      if (parts.length >= 1)
      {
        var val = undefined
        if (parts.length == 2)
          val = parts[1]
        params[parts[0]] = val
      }
    })
    return params
  }
})
