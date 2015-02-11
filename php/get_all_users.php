<?php
    ini_set('display_errors', 'On');
    error_reporting(E_ALL | E_STRICT);
    $username = 'root';
    $password = 'corvus';
    $conn = new mysqli('localhost', $username, $password, 'lomus');
    if($conn->connect_errno > 0){
        die('Unable to connect to database [' . $conn->connect_error . ']');
    }

    $sql = 'SELECT users.id, users.user_name, zipcodes.log, zipcodes.lat FROM users JOIN zipcodes ON users.zip = zipcodes.zipcode WHERE users.zip = 94555';
    if(!$result = $conn->query($sql)){
        die('There was an error running the query [' . $conn->error . ']');
    }

    $users = array();
    while($row = $result->fetch_assoc()){
        $users[] = $row;
    }
    echo json_encode($users);
?>
