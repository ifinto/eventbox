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
  $sql = "SELECT *, min(ID) FROM wp_posts WHERE post_status='new'";
  $result = $mysqli->query($sql);
  if ($result) {
    header( 'Content-Type: application/json' );
    echo json_encode($result->fetch_array(MYSQL_ASSOC));
  }
  $result->close();
  $mysqli->close();
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
  $_PUT = json_decode(file_get_contents("php://input"));
    $post_id  = $_PUT->ID;
  $post_content  = $_PUT->post_content;
  $post_date     = $_PUT->post_date;
  $post_location = $_PUT->post_location;
  $post_status   = $_PUT->post_status;

  $sql = "UPDATE wp_posts SET post_content='$post_content', post_content='$post_content', post_content='$post_content', post_status='$post_status', post_location='$post_location' WHERE id=$post_id";
  $result = $mysqli->query($sql);
  if ($result) {
    header("HTTP/1.1 200 OK");
  }
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
  parse_str($_SERVER['QUERY_STRING'], $_DELETE);
  $post_id  = $_DELETE['ID'];

  $sql = "DELETE FROM wp_posts WHERE id=$post_id";
  $result = $mysqli->query($sql);
  if ($result) {
    header("HTTP/1.1 200 OK");
  }
}


?>