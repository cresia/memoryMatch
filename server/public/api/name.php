<?php

require_once('./functions.php');
require_once('./db_connection.php');
set_exception_handler('error_handler');

startUp();

$json_input = file_get_contents('php://input');
$obj = json_decode($json_input, true);

$userNameInput = $obj['name'];
// var_dump($userNameInput);
$userAccuracy = $obj['accuracy'];
$userTime = $obj['time'];


$query = "INSERT INTO `highScores` (name, accuracy, time) VALUES ('$userNameInput', $userAccuracy, $userTime)";


$result = mysqli_query($conn, $query);


if(!$result){
  // var_dump($result);
  throw new Exception(mysqli_error($conn));
  // exit();
}else if(!mysqli_affected_rows($result) && !empty($_GET['id'])) {
  throw new Exception('Invalid ID: ' . $_GET['id']);
}else{
    $output = ['success' => true];
}


$output = [];

while($row = mysqli_fetch_assoc($result)){
  $output[] = $row;
}

print(json_encode($output))


?>
