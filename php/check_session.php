<?php

    ini_set('display_errors', 'On');
    error_reporting(E_ALL | E_STRICT);
    
    session_start();

    if(isset($_COOKIE['token'])) {
        if(isset($_SESSION[$_COOKIE['token']])) {
            // no need to login again
            $username = 'root';
            $password = 'corvus';
            $conn = new mysqli('localhost', $username, $password, 'lomus');
            if($conn->connect_errno > 0){
                die('Unable to connect to database [' . $conn->connect_error . ']');
            }

            $uid = $_SESSION[$_COOKIE['token']];    
            $sql = sprintf('SELECT name FROM users WHERE id = "%s" LIMIT 1', $uid);
            if(!$result = $conn->query($sql)){
                die('There was an error running the query [' . $conn->error . ']');
            }
            $row = $result->fetch_assoc();
            $name = $row['name'];
            $sql = sprintf('SELECT content FROM posts WHERE author_id = %u LIMIT 1', $uid);
            if(!$result = $conn->query($sql)){
                die('There was an error running the query [' . $conn->error . ']');
            }
            $row = $result->fetch_assoc();
            $row['name'] = $name;
            echo json_encode($row);
        }
    }
    else {
        echo 'need login';
    }
?>
