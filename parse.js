'use strict'
var _ = require('underscore')
var express = require('express')
var router = express.Router()
var mysql = require('mysql')
var fs = require('fs')
var Ftp = require('ftp')
var cheerio = require('cheerio')
var Promise = require('bluebird')
var request = Promise.promisifyAll(require('request'))
var iconv = require('iconv-lite')
var childProcess = require('child_process')

var mySqlConnection = mysql.createConnection({
  host     : 'db14.freehost.com.ua',
  user     : 'malyniak_carpng',
  password : 'OQoQeuNuJ',
  database : 'malyniak_carpng'
})

var url = 'http://vk.com/kharkovgo'

var childArgs = [
  'phantomjs-script.js',
  [url]
]

new Promise((resolve, reject) => {
  // childProcess.execFile('./phantomjs/bin/phantomjs', childArgs, function(err, stdout, stderr) {
  //   resolve(stdout)
  // })
  resolve(fs.readFileSync('vk.html', 'utf8'))
})
.then(function (content) {
  console.log('done parsing!')
  let $ = cheerio.load(content, {decodeEntities: false})

  $('._post.post.page_block:not(.post_fixed)').each((i, el) => {
      var allHtml = $(el).html()
      // if (allHtml.match('Когда'))

      var title = $(el).find('.wall_post_text .mem_link').first().html()
      var text = $(el).find('.wall_post_text').html()
      var thumbs = $(el).find('.page_post_sized_thumbs a').html()
      text = text.replace(/<a.*?mem_link.*?\/a>/g, '')
      text = text.replace(/<a.*?wall_post_more.*?\/a>/g, '')
      text = text.replace(/<br.*?>/g, '\n')
      
      var split = text.split('\nКогда:')

      if (split.length !== 2) return

      var intro = split[0]
      var info = 'Когда:' + split[1]
      var arr = info.split('\n')
      var detailsKeys = {
        'time': 'Время:',
        'where': 'Когда:',
        'when': 'Где:',
        'price': 'Цена:',
        'address': 'Адрес:'
      }
      var details = {}

      _.keys(detailsKeys).forEach(function (k) {
        arr.forEach(function (str) {
          var s = str.split(detailsKeys[k])
          if (s.length == 2) {
            details[k] = s[1]
          }
        })
      })
      
      console.log(details)
      console.log('======================')
  })
})



// return new Promise((resolve, reject) => {
//   let options = {
//     uri: src,
//     encoding: null,
//     headers: {
//       'User-Agent': 'Mozilla/5.0 (Windows NT 10.0 WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36'
//     }
//   }
//   request(options, function (err, response, body) {
//     var converted = iconv.decode(body, 'win1251')
//   	// converted = iconv.encode(body, 'utf8')
//   	//fs.writeFile('vk.html', converted)
//     let $ = cheerio.load(converted)
//     console.log($('body').html())

//     $('._post.post.page_block:not(.post_fixed)').each((i, el) => {
//         var allHtml = $(el).html()
//         // if (allHtml.match('Когда'))

//         var title = $(el).find('.wall_post_text .mem_link').first().html()
//         var text = $(el).find('.wall_post_text').html()
//         var thumbs = $(el).find('.page_post_sized_thumbs a').html()
//         text = text.replace(/<a.*?mem_link.*?\/a>/g, '')
//         text = text.replace(/<a.*?wall_post_more.*?\/a>/g, '')
//         text = text.replace(/<br.*?>/g, '\n')
        
//         var split = text.split('\nКогда:')

//         if (split.length !== 2) return

//         var intro = split[0]
//         var info = 'Когда:' + split[1]
//         var arr = info.split('\n')
//         var detailsKeys = {
//           'where': 'Когда:',
//           'when': 'Где:',
//           'price': 'Цена:',
//           'address': 'Адрес:'
//         }
//         var details = {}

//         _.keys(detailsKeys).forEach(function (k) {
//           arr.forEach(function (str) {
//             var s = str.split(detailsKeys[k])
//             console.log(s)
//             details[k] = s.length == 2 ? s[2] : ''
//           })
//         })
        
//         console.log(details)
//     })
//   })
// })


// let $ = cheerio.load(fs.readFileSync('./data/vk.html', {encoding: 'utf-8'}))
// $('._post').each((i, el) => {
//   console.log($(el).find('.wall_post_text .mem_link').first().html())
// })





// var termsQueries = ['SELECT * FROM  `wp_terms`', 'SELECT * FROM  `wp_term_taxonomy`']
// Promise.map(termsQueries, function (query) {
//   return new Promise((resolve, reject) => {
//     mySqlConnection.query(query, function(err, rows, fields) {
//       if (err) throw err
//       resolve(rows)
//     })
//   })
// }).then((results) => {
//   var terms         = results[0]
//   var term_taxonomy = results[1]

//   var categories = _.reduce(terms, (arr, el) => {
//     var found = _.find(term_taxonomy, (_el) => {
//       return _el.term_id === el.term_id && _el.taxonomy === 'category'
//     })
//     if (found) arr.push(_.extend({}, el, found))
//     return arr
//   }, [])

//   var tags = _.reduce(terms, (arr, el) => {
//     var found = _.find(term_taxonomy, (_el) => {
//       return _el.term_id === el.term_id && _el.taxonomy === 'post_tag'
//     })
//     if (found) arr.push(_.extend({}, el, found))
//     return arr
//   }, [])

//   res.json({
//     categories: categories,
//     tags: tags
//   })
// })
