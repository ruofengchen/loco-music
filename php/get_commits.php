<?php
    ini_set('display_errors', 'On');
    error_reporting(E_ALL | E_STRICT);
    $uid = $_GET['uid'];
    $username = 'root';
    $password = 'corvus';
    $conn = new mysqli('localhost', $username, $password, 'lomus');
    if($conn->connect_errno > 0){
        die('Unable to connect to database [' . $conn->connect_error . ']');
    }
    $sql = sprintf('SELECT songs.title, songs.artist, c.id, c.current_version, s.r0, s.r1, s.r2, s.r3, s.r4 FROM commits AS c JOIN songs ON song_id = songs.id JOIN sessions AS s ON s.commit_id = c.id WHERE author_id = %u AND s.version = current_version LIMIT 1 ', $uid);
    if(!$result = $conn->query($sql)){
        die('There was an error running the query [' . $conn->error . ']');
    }
    $row = $result->fetch_assoc();
    echo json_encode($row);
