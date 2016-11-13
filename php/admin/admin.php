<?php
$servername = "db14.freehost.com.ua";
$username = "malyniak_ebox";
$password = "m6eJuX6D7";
$dbname = "malyniak_ebox";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
  ?>

<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Event Box</title>
	<link rel="stylesheet" type="text/css" href="style.css" />
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


