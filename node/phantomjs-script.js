var webPage = require('webpage')
var system = require('system')
var page = webPage.create()
var url = system.args[1]
var Promise = require('bluebird')
var fs = require('fs')

page.open(url, function(status) {
  new Promise(function (resolve, reject) {
    setTimeout(resolve, 1000)
  }).then(function () {
    return new Promise(function (resolve, reject) {
      page.evaluate(function() {
        window.scrollBy(0, 100000)
      })
      resolve()
    })
  }).then(function () {
    return new Promise(function (resolve, reject) {
      setTimeout(resolve, 1000)
    })
  }).then(function () {
    return new Promise(function (resolve, reject) {
      page.evaluate(function() {
        window.scrollBy(0, 100000)
      })
      resolve()
    })
  }).then(function () {
    return new Promise(function (resolve, reject) {
      setTimeout(resolve, 1000)
    })
  }).then(function () {
    fs.write('vk.html', page.content, 'w')
    phantom.exit()
  })
})