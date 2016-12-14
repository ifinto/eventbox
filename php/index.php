<?php
$servername = "db14.freehost.com.ua";
$username = "malyniak_ebox";
$password = "m6eJuX6D7";
$dbname = "malyniak_ebox";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 
$conn->set_charset("utf8");

$sql = "SELECT * FROM `posts` WHERE post_status='publish'";
$result = $conn->query($sql);

$conn->close();
?>


<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Event Box</title>
  <link href="https://fonts.googleapis.com/css?family=Noto+Serif" rel="stylesheet">
	<link rel="stylesheet" type="text/css" href="css/style.css" />
	<script type="text/javascript" src="app.js"></script>
</head>
<body>
  <div class="container" style="width: 960px; margin: 20px auto 0;">
    
  <?php
  if ($result->num_rows > 0) {
      // output data of each row
      while($row = $result->fetch_assoc()) {
          // echo "[" . $row["ID"]. "]<br>";
          echo $row["post_title"]. "<br>";
          echo $row["post_content"]. "<br>";
          echo "<br>===============================<br><br>";
      }
  } else {
      echo "0 results";
  }
  ?>

  </div>
</body>
</html>


