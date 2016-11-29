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
  $_POST = json_decode(file_get_contents("php://input"));
  $description = $mysqli->real_escape_string($_POST->description);
  $address     = $_POST->address;
  $title       = $_POST->title;
  $sql = "INSERT INTO locations (description, address, title) VALUES('$description', '$address', '$title')";
  echo $sql;
  $result = $mysqli->query($sql);
  if ($result) {
    header("HTTP/1.1 200 OK");
  }
  $mysqli->close();
}



?>