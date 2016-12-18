var express = require('express')
var mysql = require('mysql')
var db_config = require('../../modules/db_config')
var router = express.Router()

router.get('/', function(req, res, next) {
  var connection = mysql.createConnection(db_config)
  var query = 'SELECT * FROM locations'
  connection.query(query, (err, rows) => {
    res.json(rows)
  })
  connection.end();
})

router.post('/', function(req, res, next) {
  var connection = mysql.createConnection(db_config)
  var query = `INSERT INTO locations (
                description,
                address,
                title
              ) VALUES(
                '${req.body.description}',
                '${req.body.address}',
                '${req.body.title}'
              )`
  connection.query(query, (err, rows) => {
    res.json({id: rows.insertId})
  })
  connection.end();
})

module.exports = router;
