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
var dateFormat = require('dateformat')

var unique_text = require('./modules/unique_text')

var mySqlConnection = mysql.createConnection({
  host     : 'db14.freehost.com.ua',
  user     : 'malyniak_ebox',
  password : 'm6eJuX6D7',
  database : 'malyniak_ebox'
})

var dbShingles = []
var globalRegExps = ['[0-2]d[:.][0-5]d','сегодня','завтра']

new Promise((resolve, reject) => {
  var Q = 'SELECT ID, post_shingles from posts'
  mySqlConnection.query(Q, (err, rows, fields) => {
    dbShingles = rows
    resolve()
  })
}).then(function () {
  return new Promise((resolve, reject) => {
    var Q = 'SELECT * from locations'
    mySqlConnection.query(Q, (err, rows, fields) => {
      resolve(rows)
    })
  })
}).then(function (locations) {
  return new Promise((resolve, reject) => {
    var Q = 'SELECT * from sources'
    mySqlConnection.query(Q, (err, rows, fields) => {
      resolve(rows)
    })
  })
}).mapSeries(function (source) {
  console.log('source', source)
  return new Promise((resolve, reject) => {
    childProcess.execFile('./phantomjs/bin/phantomjs', ['phantomjs-script.js', [source.url]], function(err, stdout, stderr) {
      if (err) console.log('Error at phantom.js: ', err);
      resolve(stdout)
    })
    // resolve(fs.readFileSync('vk.html', 'utf8'))
  }).then(function (content) {
    console.log('done parsing!')
    var content = fs.readFileSync('vk.html')
    let $ = cheerio.load(content, {decodeEntities: false})
    var posts = []
    $('._post.post.page_block:not(.post_fixed)').each((i, el) => {
      var allHtml = $(el).html()
      var post = {};
      post.source_url = source.url +'?w=wall'+ $(el).attr('data-post-id')
      console.log('post.source_url', post.source_url)
      post.title = $(el).find('.wall_post_text .mem_link').first().html()
      post.thumbs = $(el).find('.page_post_sized_thumbs a').html()
      var sourcePublished = $(el).find('.rel_date').html()
      if (!!sourcePublished) {
        post.source_published = convertPublishedDate(sourcePublished)
      }
      var text = $(el).find('.wall_post_text').html()

      if (!passRegexContent(text, globalRegExps)) {
        console.log('regex not passed')
        return
      }
      text = cleanVkText(text)
      var isUnique = _.find(dbShingles, (sh) => {
        var guess = unique_text.getUniqueness(text, sh.post_shingles) > 0.5
        if (guess) console.log('is duplicate of post ID =', sh.ID)
        return guess
      })

      if (isUnique) return
      if ($(el).find('.copy_quote').length > 0) return

      post.text = text
      posts.push(post)
    })
    return posts
  }).mapSeries(function (post) {
    console.log('=====================')
    post.title = post.title || ''
    post.guid = Math.floor(Math.random() * 1000000000)
    post.name = post.title.replace(/\s+/g, '-').toLowerCase() + '-' + post.guid
    post.date = new Date().toISOString().slice(0, 19).replace('T', ' ')
    post.shingles = unique_text.generateShingles(post.text)
    post.locationID = source.locationID || null

    var query = insertSqlQuery('posts', {
      'post_author':           1,
      'post_content':          escapeQuotes(post.text),
      'post_title':            escapeQuotes(post.title),
      'post_status':           'new',
      'post_name':             post.guid,
      'post_type':             'post',
      'post_shingles':         post.shingles,
      'post_date_added':       'NOW()',
      'post_source_published': post.source_published,
      'post_location':         post.locationID,
      'post_source_url':       post.source_url
    })

    return new Promise((resolve, reject) => {
      mySqlConnection.query(query, function(err, rows, fields) {
        if (err) throw err
        console.log('MySQL query success; rows: ', rows.affectedRows)
        resolve()
      })
    })
  })

}).then(function (content) {
  console.log('DONE!')
  process.exit()
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
  var query = 'INSERT INTO `' + table + '` ('+ headers.join(',') +') VALUES ('+ values.join(',') +')'
  query = query.replace('\'NOW()\'', 'NOW()')
  return query
}    

function escapeQuotes(str) {
  return str.replace(/'/g, "\\$&");
} 

function getVkDetails(text) {
  var details = {}
  var matches = text.match(/((.|\n)*)((\Время:|\Когда:|\Цена:)(.|\n)*)/im)

  if (!!matches) {
    var arr = matches[3].split('\n')
    var detailsKeys = {
      'time':    /Время:(.*)/i,
      'where':   /Когда:(.*)/i,
      'when':    /Где:(.*)/i,
      'price':   /Цена:(.*)/i,
      'address': /Адрес:(.*)/i
    }

    _.keys(detailsKeys).forEach(function (k) {
      arr.forEach(function (str) {
        var m = str.match(detailsKeys[k])
        if (m && m.length >= 2) {
          details[k] = m[1].trim()
        }
      })
    })
  }
  return details
}

function cleanVkText(text) {
  return text.replace(/<img.*?>/g, '')
   .replace(/<a.*?mem_link.*?\/a>/g, '')
   .replace(/<a.*?wall_post_more.*?\/a>/g, '')
   .replace(/<a href="\/away.php\?to=(.*?)&.*?"/g, '<a href="$1"')
   .replace(/<span style="display: none">/g, '')
   .replace(/<a href="\/feed.*?>(.*)<\/a>/g, '$1')
   .replace(/onclick="return mentionClick\(this, event\)"/g, '')
   .replace(/onmouseover="mentionOver\(this\)"/g, '')
   .replace(/mention_id=".*?"/g, '')
   .replace(/<br.*?>/g, '\n')
}

function passRegexContent(text, regs) {
  var found = regs.find((reg) => {
    var regEx = new RegExp(reg)
    return !!text.match(regEx)
  })
  return !!found
}

function convertPublishedDate(str) {
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'] //ru: ['янв','фев','мар','апр','мая','июн','июл','авг','сен','окт','ноя','дек'] 
  var date = new Date()
  date.setHours(0,0,0,0)
  var splitted = str.split(' at ') //ru: ' в '
  if (splitted.length === 1) return
  if (!!splitted[0].match('yesterday')) { //ru: 'вчера'
    date = new Date(date.getTime() - 86400000)
  } else if (!splitted[0].match('today')) {
    var s = splitted[0].split(' ')
    date.setDate(s[0])
    date.setMonth(months.indexOf(s[1]))
  }

  var time = splitted[1].split(' ')
  var h = parseInt(time[0].split(':')[0]) + (time[1] == 'pm' ? 12 : 0) 
  var m = time[0].split(':')[1]
  date.setHours(h)
  date.setMinutes(m)
  if (typeof date.getMonth !== 'function') date = new Date()
  return dateFormat(date, 'yyyy-mm-dd HH:MM:ss')
}