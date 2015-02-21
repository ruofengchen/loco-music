<?php

    ini_set('display_errors', 'On');
    error_reporting(E_ALL | E_STRICT);
    
    session_start();

    if(isset($_COOKIE['token']) && isset($_SESSION[$_COOKIE['token']])) {
        // no need to login again
        $username = 'root';
        $password = 'corvus';
        $conn = new mysqli('localhost', $username, $password, 'lomus');
        if($conn->connect_errno > 0){
            die('Unable to connect to database [' . $conn->connect_error . ']');
        }

        $uid = $_SESSION[$_COOKIE['token']];    
        $sql = sprintf('SELECT id, name, district_x, district_y, lat, log FROM users WHERE id = "%s" LIMIT 1', $uid);
        if(!$result = $conn->query($sql)){
            die('There was an error running the query [' . $conn->error . ']');
        }
        $row1 = $result->fetch_assoc();
        $sql = sprintf('SELECT content FROM posts WHERE author_id = %u LIMIT 1', $uid);
        if(!$result = $conn->query($sql)){
            die('There was an error running the query [' . $conn->error . ']');
        }
        $row2 = $result->fetch_assoc();
        echo json_encode(array_merge($row1, $row2));
    }
    else {
        echo 'need login';
    }
?>
