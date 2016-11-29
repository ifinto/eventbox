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
  $post_status = $_GET["post_status"];
  $sql = "SELECT *, min(ID) FROM posts WHERE post_status='". $post_status ."'";
  $result = $mysqli->query($sql);
  if ($result) {
    header( 'Content-Type: application/json' );
    echo json_encode($result->fetch_array(MYSQL_ASSOC));
  }
  $result->close();
  $mysqli->close();
}

// TODO POST!
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $_POST = json_decode(file_get_contents("php://input"));
  $post_id  = $_POST->ID;
  $post_content  = $mysqli->real_escape_string($_POST->post_content);
  $post_date     = $_POST->post_date;
  $post_date_added = $_POST->post_date;
  $post_source_published = $_POST->post_source_published;
  $post_location = $_POST->post_location;
  $post_status   = $_POST->post_status;
  $post_status   = $_POST->post_status;
  $sql = "INSERT INTO posts (post_date_added, post_source_published, post_date, post_content, post_status, post_location) VALUES(NOW(), $post_source_published, $post_date, $post_content, $post_status, $post_location)"; 
  echo $sql;
  $result = $mysqli->query($sql);
  if ($result) {
    header("HTTP/1.1 200 OK");
  }
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
  $_PUT = json_decode(file_get_contents("php://input"));
  $post_id  = $_PUT->ID;
  $post_content  = $mysqli->real_escape_string($_PUT->post_content);
  $post_date     = $_PUT->post_date;
  $post_location = $_PUT->post_location;
  $post_status   = $_PUT->post_status;
  $sql = "UPDATE posts SET post_date='$post_date', post_content='$post_content', post_status='$post_status', post_location='$post_location' WHERE id=$post_id";
  echo $sql;
  $result = $mysqli->query($sql);
  if ($result) {
    header("HTTP/1.1 200 OK");
  }
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
  parse_str($_SERVER['QUERY_STRING'], $_DELETE);
  $post_id  = $_DELETE['ID'];

  $sql = "UPDATE posts SET post_status='deleted' WHERE id=$post_id";
  $result = $mysqli->query($sql);
  if ($result) {
    header("HTTP/1.1 200 OK");
  }
}


?>