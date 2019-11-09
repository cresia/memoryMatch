<?php

require_once('./functions.php');
require_once('./db_connection.php');
set_exception_handler('error_handler');

startUp();

$json_input = file_get_contents('php://input');
$obj = json_decode($json_input, true);

$userNameInput = $obj['name'];
$userAccuracy = $obj['accuracy'];
$userTime = $obj['time'];


$query = "INSERT INTO `highScores` (name, accuracy, time) VALUES ('$userNameInput', $userAccuracy, $userTime)";


$result = mysqli_query($conn, $query);


if(!$result){
  // var_dump($result);
  throw new Exception(mysqli_error($conn)); //if the query fails
  // exit();
}



print(json_encode($obj))


?>
