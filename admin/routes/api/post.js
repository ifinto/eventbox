var _ = require('underscore')
var express = require('express')
var mysql = require('mysql')
var db_config = require('../../modules/db_config')
var router = express.Router()

router.get('/:id', function(req, res, next) {
  var connection = mysql.createConnection(db_config)
  var postStatus = req.query.post_status
  var query = "SELECT * FROM posts WHERE ID='" + req.params.id + "'"

  connection.query(query, (err, rows) => {
    res.json(rows[0])
  })
  connection.end();
})

router.get('/', function(req, res, next) {
  var connection = mysql.createConnection(db_config)
  var postStatus = req.query.post_status
  if (typeof postStatus === 'undefined') postStatus = 'new'
  var query = "SELECT *, min(ID) FROM posts WHERE post_status='" + postStatus + "'"

  connection.query(query, (err, rows) => {
    res.json(rows[0])
  })
  connection.end();
})

router.post('/', function(req, res, next) {
  var connection = mysql.createConnection(db_config)
  var query = `
    INSERT INTO posts (
      post_date_added,
      post_source_published,
      post_content,
      post_date,
      post_time,
      post_location,
      post_status
    ) VALUES(
    NOW(),
      ${req.body.post_source_published},
      ${req.body.post_content},
      ${req.body.post_date},
      ${req.body.post_time},
      ${req.body.post_location},
      ${req.body.post_status}
    )
  `
  connection.query(query, (err, rows) => {
    res.json(rows)
  })
  connection.end();
})

router.put('/', function(req, res, next) {
  var connection = mysql.createConnection(db_config)
  var post_content = mysql.escape(req.body.post_content)
  var query = `UPDATE posts SET
    post_content   = ${post_content},
    post_date_from ='${req.body.post_date_from}',
    post_date_to   ='${req.body.post_date_to}',
    post_time_from ='${req.body.post_time_from}',
    post_time_to   ='${req.body.post_time_to}',
    post_location  ='${req.body.post_location}',
    post_status    ='${req.body.post_status}'
    WHERE id='${req.body.ID}'`
    console.log(query)

  connection.query(query, (err, rows) => {
    res.json(rows)
  })
  connection.end();
})

router.delete('/', function(req, res, next) {
  var connection = mysql.createConnection(db_config)
  var query = `UPDATE posts SET post_status='deleted' WHERE id=${req.body.ID}`

  connection.query(query, (err, rows) => {
    res.json(rows)
  })
  connection.end();
})

module.exports = router;
