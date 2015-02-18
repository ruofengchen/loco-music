<?php
    ini_set('display_errors', 'On');
    error_reporting(E_ALL | E_STRICT);
    $lat = $_GET['lat'];
    $log = $_GET['log'];
    $district_x = intval($lat / 0.1);
    $district_y = intval($log / 0.1);
    $username = 'root';
    $password = 'corvus';
    $conn = new mysqli('localhost', $username, $password, 'lomus');
    if($conn->connect_errno > 0){
        die('Unable to connect to database [' . $conn->connect_error . ']');
    }

    $sql = 'SELECT id, name, user_name, log, lat, type FROM users WHERE district_x >= ' . ($district_x-1) . ' AND district_x <= ' . ($district_x+1) . ' AND district_y >= ' . ($district_y-1) . ' AND district_y <= ' . ($district_y+1);
    if(!$result = $conn->query($sql)){
        die('There was an error running the query [' . $conn->error . ']');
    }

    $users = array();
    while($row = $result->fetch_assoc()){
        $users[$row['id']] = $row;
    }
    echo json_encode($users);
?>
