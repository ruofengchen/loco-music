<?php
    ini_set('display_errors', 'On');
    error_reporting(E_ALL | E_STRICT);
    $pid = $_GET['pid'];
    $username = 'root';
    $password = 'corvus';
    $conn = new mysqli('localhost', $username, $password, 'lomus');
    if($conn->connect_errno > 0){
        die('Unable to connect to database [' . $conn->connect_error . ']');
    }

    $sql = sprintf('SELECT name, content FROM comments JOIN users ON users.id = comments.author_id WHERE comments.post_id = %u', $pid);
    if(!$result = $conn->query($sql)){
        die('There was an error running the query [' . $conn->error . ']');
    }
    $comments = array();
    while($row = $result->fetch_assoc()){
        $comments[] = $row;
    }
    echo json_encode($comments);

?>

