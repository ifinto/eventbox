var _ = require('underscore')
var express = require('express')
var mysql = require('mysql')
var db_config = require('../../modules/db_config')
var router = express.Router()

router.get('/', function(req, res, next) {
  var connection = mysql.createConnection(db_config)
  var postStatus = req.query.post_status
  var query = "SELECT * FROM posts WHERE post_status='published'"

  connection.query(query, (err, rows) => {
    res.json(rows[0])
  })
  connection.end();
})

module.exports = router;
