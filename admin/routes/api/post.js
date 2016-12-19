var _ = require('underscore')
var express = require('express')
var mysql = require('mysql')
var db_config = require('../../modules/db_config')
var router = express.Router()

router.get('/:id', function(req, res, next) {
  var connection = mysql.createConnection(db_config)
  var postStatus = req.query.post_status
  var query = "SELECT * FROM posts WHERE id='" + req.params.id + "'"

  connection.query(query, (err, rows) => {
    res.json(rows[0])
  })
  connection.end();
})

router.get('/', function(req, res, next) {
  var query = ''
  var connection = mysql.createConnection(db_config)
  var postStatus = req.query.post_status

  if (typeof postStatus === 'undefined') postStatus = 'new'
  if (typeof req.query.id !== 'undefined') {
    var id = req.query.id
    query = `SELECT * FROM posts WHERE id = ${id}`
  } else if (typeof req.query.before !== 'undefined') {
    var id = req.query.before || 10e12
    console.log('id', id)
    query = `SELECT *, min(id) FROM posts WHERE id < ${id} AND post_status='${postStatus}'`
  } else if (typeof req.query.after !== 'undefined') {
    var id = req.query.after || 0
    query = `SELECT *, max(id) FROM posts WHERE id > ${id} AND post_status='${postStatus}'`
  } else {
    query = `SELECT *, min(id) FROM posts WHERE post_status='${postStatus}'`
  }

  connection.query(query, (err, rows) => {
    res.json(rows.length > 0 ? rows[0] : {})
  })
  connection.end();
})

router.post('/', function(req, res, next) {
  var connection = mysql.createConnection(db_config)
  var post_content = mysql.escape(req.body.post_content)
  var query = `
    INSERT INTO posts (
      post_date_added,
      post_title,
      post_content,
      post_date_from,
      post_date_to,
      post_time_from,
      post_time_to,
      post_location,
      post_status
    ) VALUES(
      NOW(),
      '${req.body.post_title}',
       ${post_content},
      '${req.body.post_date_from}',
      '${req.body.post_date_to}',
      '${req.body.post_time_from}',
      '${req.body.post_time_to}',
      '${req.body.post_location}',
      '${req.body.post_status}'
    )
  `
  connection.query(query, (err, rows) => {
    if (err) console.error(err)
    res.json(rows)
  })
  connection.end();
})

router.put('/:id', function(req, res, next) {
  var connection = mysql.createConnection(db_config)
  var post_content = mysql.escape(req.body.post_content)
  var query = `UPDATE posts SET
    post_title     ='${req.body.post_title}',
    post_content   = ${post_content},
    post_date_from ='${req.body.post_date_from}',
    post_date_to   ='${req.body.post_date_to}',
    post_time_from ='${req.body.post_time_from}',
    post_time_to   ='${req.body.post_time_to}',
    post_location  ='${req.body.post_location}',
    post_status    ='${req.body.post_status}'
    WHERE id='${req.body.id}'`

  connection.query(query, (err, rows) => {
    res.json(rows)
  })
  connection.end();
})

router.delete('/', function(req, res, next) {
  var connection = mysql.createConnection(db_config)
  var query = `UPDATE posts SET post_status='deleted' WHERE id=${req.body.id}`

  connection.query(query, (err, rows) => {
    res.json(rows)
  })
  connection.end();
})

module.exports = router;
