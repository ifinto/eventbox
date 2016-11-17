<?php 
include 'config.php';

// Create connection
$mysqli = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
} 
$mysqli->set_charset("utf8");

$stmt = $mysqli->prepare("INSERT INTO `drafts` (post_content, post_date, post_location) VALUES (?, ?, ?)");
$stmt->bind_param("i", 
  $_POST['post_content'],
  $_POST['post_date'],
  $_POST['post_location']
)
$stmt->execute();

echo 'OK';

$mysqli->close();

?>
