<?php
    ini_set('display_errors', 'On');
    error_reporting(E_ALL | E_STRICT);
    $uid = _GET['uid'];
    $username = 'root';
    $password = 'corvus';
    $conn = new mysqli('localhost', $username, $password, 'lomus');
    if($conn->connect_errno > 0){
        die('Unable to connect to database [' . $conn->connect_error . ']');
    }
    $sql = sprintf('SELECT name FROM users WHERE id = %u LIMIT 1', $uid);
    if(!$result = $conn->query($sql)){
        die('There was an error running the query [' . $conn->error . ']');
    }
    $row = $result->fetch_assoc();
    $user_data = $row;

    $sql = sprintf('SELECT content FROM posts WHERE author_id = %u', $uid);
    if(!$result = $conn->query($sql)){
        die('There was an error running the query [' . $conn->error . ']');
    }
    $posts = array();
    while($row = $result->fetch_assoc()){
        $posts[] = $row;
    }

    $user_data['posts'] = $posts;
    echo json_encode($user_data);

?>
