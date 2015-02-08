<?php
    ini_set('display_errors', 'On');
    error_reporting(E_ALL | E_STRICT);
    $username = 'root';
    $password = 'corvus';
    $conn = new mysqli('localhost', $username, $password, 'lomus');
    if($conn->connect_errno > 0){
        die('Unable to connect to database [' . $conn->connect_error . ']');
    }

    $sql = 'SELECT * FROM users';
    if(!$result = $conn->query($sql)){
        die('There was an error running the query [' . $conn->error . ']');
    }

    while($row = $result->fetch_assoc()){
        echo json_encode($row);
    }

?>
