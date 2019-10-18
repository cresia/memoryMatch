<?php

function error_handler($error){
  $output = array(
    "success" => false,
    "error" => $error->getMessage()
  );

  $json_output = json_encode($output);
  http_response_code(500);
  print($json_output);
}


function startup(){
  header('Content-Type: application/json');
}


function getBodyData(){
  $json = file_get_contents('php://input');
  $data = json_decode($json, true);// return json into a variable while encode return a json
  return $data;
}

?>
