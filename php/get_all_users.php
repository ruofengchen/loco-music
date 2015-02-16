<?php
    ini_set('display_errors', 'On');
    error_reporting(E_ALL | E_STRICT);
    $zip = $_GET['zip'];
    $username = 'root';
    $password = 'corvus';
    $conn = new mysqli('localhost', $username, $password, 'lomus');
    if($conn->connect_errno > 0){
        die('Unable to connect to database [' . $conn->connect_error . ']');
    }

    $sql = 'SELECT id, name, user_name FROM users WHERE zip = ' . $zip;
    if(!$result = $conn->query($sql)){
        die('There was an error running the query [' . $conn->error . ']');
    }

    $ret = array();
    $users = array();
    while($row = $result->fetch_assoc()){
        $users[] = $row;
    }

    $sql = 'SELECT log, lat FROM zipcodes WHERE zipcode = ' . $zip . ' LIMIT 1';
    if(!$result = $conn->query($sql)){
        die('There was an error running the query [' . $conn->error . ']');
    }
    $row = $result->fetch_assoc();
    $ret['users'] = $users;
    $ret['log'] = $row['log'];
    $ret['lat'] = $row['lat'];
    echo json_encode($ret);
?>
