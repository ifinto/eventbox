<?php 
include 'config.php';

// Create connection
$mysqli = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($mysqli->connect_error) {
  die("Connection failed: " . $mysqli->connect_error);
} 
$mysqli->set_charset("utf8");

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  $sql = "SELECT * FROM locations";
  $result = $mysqli->query($sql);
  if ($result) {
    header( 'Content-Type: application/json' );
    echo json_encode($result->fetch_array(MYSQL_ASSOC));
  }
  $result->close();
  $mysqli->close();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
}


?>