var _ = require('underscore')
var express = require('express')
var mysql = require('mysql')
var db_config = require('../modules/db_config')
var router = express.Router()

router.get('/', function(req, res, next) {
  var connection = mysql.createConnection(db_config)
  var postStatus = req.query.post_status
  var query = "SELECT * FROM posts WHERE post_status='published'"

  connection.query(query, (err, rows) => {
    rows = rows.map((row) => {
      row.post_images = !!row.post_images ? JSON.parse(row.post_images) : []
      return row
    })
    console.log(rows[0].post_content)
    res.render('index', {
      title: 'Index page',
      posts: rows
    })
  })
  connection.end();
})


module.exports = router;
