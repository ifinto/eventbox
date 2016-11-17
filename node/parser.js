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
  // childProcess.execFile('./phantomjs/bin/phantomjs', childArgs, function(err, stdout, stderr) {
  //   if (err) console.log('Error at phantom.js: ', err);
  //   resolve(stdout)
  // })
  resolve(fs.readFileSync('vk.html', 'utf8'))
}).then(function (content) {
  console.log('done parsing!')
  var content = fs.readFileSync('vk.html')
  let $ = cheerio.load(content, {decodeEntities: false})
  console.log('length', $('._post.post.page_block:not(.post_fixed)').length);
  var posts = []
  $('._post.post.page_block:not(.post_fixed)').each((i, el) => {
    var allHtml = $(el).html()
    var post = {};
    post.title = $(el).find('.wall_post_text .mem_link').first().html()
    post.thumbs = $(el).find('.page_post_sized_thumbs a').html()
    var text = $(el).find('.wall_post_text').html()
    text = text.replace(/<img.*?>/g, '')
     .replace(/<a.*?mem_link.*?\/a>/g, '')
     .replace(/<a.*?wall_post_more.*?\/a>/g, '')
     .replace(/<a href="\/away.php\?to=(.*?)&.*?"/g, '<a href="$1"')
     .replace(/<span style="display: none">/g, '')
     .replace(/<a href="\/feed.*/g, '')
     .replace(/onclick="return mentionClick\(this, event\)"/g, '')
     .replace(/onmouseover="mentionOver\(this\)"/g, '')
     .replace(/mention_id=".*?"/g, '')
     .replace(/<br.*?>/g, '\n')

    var matches = text.match(/((.|\n)*)((\Время:|\Когда:|\Цена:)(.|\n)*)/im)

    if (!!matches) {
      post.text = matches[1]
      var arr = matches[3].split('\n')
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
    } else {
      post.text = text
    }

    posts.push(post)
  })
  return posts
}).mapSeries(function (post) {
  post.title = post.title || ''
  post.guid = Math.floor(Math.random() * 1000000000)
  post.name = post.title.replace(/\s+/g, '-').toLowerCase() + '-' + post.guid
  post.date = new Date().toISOString().slice(0, 19).replace('T', ' ')
  var query = insertSqlQuery('wp_posts', {
    'post_author':        1,
    'post_content':       escapeQuotes(post.text),
    'post_title':         escapeQuotes(post.title),
    'post_status':        'new',
    'post_name':          post.guid,
    'post_type':          'post'
  })
  return new Promise((resolve, reject) => {
    mySqlConnection.query(query, function(err, rows, fields) {
      if (err) throw err
      console.log('MySQL query success; rows: ', rows.affectedRows)
      resolve()
    })
  })
})

function insertNewPost() {
}

function insertSqlQuery(table, params) {
  var headers = []
  var values = []

  Object.keys(params).forEach(function (key) {
    headers.push('`' +key +'`')
    values.push('\'' +params[key] +'\'')
  })
  return 'INSERT INTO `' + table + '` ('+ headers.join(',') +') VALUES ('+ values.join(',') +')'
}    

function escapeQuotes(str) {
  return str.replace(/'/g, "\\$&");
} 