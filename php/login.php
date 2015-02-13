<?php
    ini_set('display_errors', 'On');
    error_reporting(E_ALL | E_STRICT);
    $un = $_GET['un'];
    $pw = $_GET['pw'];
    $username = 'root';
    $password = 'corvus';
    $conn = new mysqli('localhost', $username, $password, 'lomus');
    if($conn->connect_errno > 0){
        die('Unable to connect to database [' . $conn->connect_error . ']');
    }
    $sql = sprintf('SELECT passwd_salt FROM users WHERE user_name = "%s" LIMIT 1', $un);
    if(!$result = $conn->query($sql)){
        die('There was an error running the query [' . $conn->error . ']');
    }
    $row = $result->fetch_assoc();
    if($pw==$row['passwd_salt']) {
        echo "login success";
    } 
    else {
        echo "login failure";
    }
