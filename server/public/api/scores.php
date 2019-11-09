<?php

require_once('./functions.php');
set_exception_handler('error_handler');
startUp();
require_once('./db_connection.php');

$query = "SELECT * FROM `highScores` ORDER BY `time` DESC, `accuracy` DESC LIMIT 5";
$result = mysqli_query($conn, $query);

$data = [];

while($row = mysqli_fetch_assoc($result)){
  $data[]= $row;
}

print(json_encode($data));


?>
