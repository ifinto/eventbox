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
  user     : 'malyniak_ebox',
  password : 'm6eJuX6D7',
  database : 'malyniak_ebox'
})

// var url = 'http://vk.com/kharkovgo'
var url = 'https://vk.com/rating_kh'

var childArgs = [
  'phantomjs-script.js',
  [url]
]

new Promise((resolve, reject) => {
  childProcess.execFile('./phantomjs/bin/phantomjs', childArgs, function(err, stdout, stderr) {
    if (err) console.log('Error at phantom.js: ', err);
    resolve(stdout)
  })
  // resolve(fs.readFileSync('vk.html', 'utf8'))
})
.then(function (content) {
  console.log('done parsing!')
  var content = fs.readFileSync('vk.html')
  let $ = cheerio.load(content, {decodeEntities: false})
  console.log('length', $('._post.post.page_block:not(.post_fixed)').length);
  $('._post.post.page_block:not(.post_fixed)').each((i, el) => {
      var post = {}
      var allHtml = $(el).html()
      post.title = $(el).find('.wall_post_text .mem_link').first().html()
      var text = $(el).find('.wall_post_text').html()
      var thumbs = $(el).find('.page_post_sized_thumbs a').html()
      text = text.replace(/<img.*?>/g, '')
      text = text.replace(/<a.*?mem_link.*?\/a>/g, '')
      text = text.replace(/<a.*?wall_post_more.*?\/a>/g, '')
      text = text.replace(/<span style="display: none">/g, '')
      text = text.replace(/<a href="\/feed.*/g, '')
      text = text.replace(/onclick="return mentionClick\(this, event\)"/g, '')
      text = text.replace(/onmouseover="mentionOver\(this\)"/g, '')
      text = text.replace(/mention_id=".*?"/g, '')
      text = text.replace(/<br.*?>/g, '\n')
      var matches = text.match(/(.|\n)*((\Время:|\Когда:|\Цена:)(.|\n)*)/im)

      if (!matches) return

      var info = matches[0]
      var arr = info.split('\n')
      var detailsKeys = {
        'time':    /Время:(.*)/i,
        'where':   /Когда:(.*)/i,
        'when':    /Где:(.*)/i,
        'price':   /Цена:(.*)/i,
        'address': /Адрес:(.*)/i
      }
      var details = {}

      _.keys(detailsKeys).forEach(function (k) {
        arr.forEach(function (str) {
          var m = str.match(detailsKeys[k])
          if (m && m.length >= 2) {
            details[k] = m[1].trim()
          }
        })
      })
      console.log('*************************');
      console.log(details);
      console.log('*************************');
      
      // console.log(details)
      console.log('======================')
  })
})
