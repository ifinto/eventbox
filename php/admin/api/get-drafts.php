<?php 
$servername = "db14.freehost.com.ua";
$username = "malyniak_ebox";
$password = "m6eJuX6D7";
$dbname = "malyniak_ebox";

// Create connection
$mysqli = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
} 
$mysqli->set_charset("utf8");

$sql = "SELECT *, min(ID) FROM `drafts`";
$result = $mysqli->query($sql);

$myArray = array();

if ($result) {
  while($row = $result->fetch_array(MYSQL_ASSOC)) {
    $myArray[] = $row;
  }
  header( 'Content-Type: application/json' );
  echo json_encode($myArray);
}

$result->close();
$mysqli->close();

?>