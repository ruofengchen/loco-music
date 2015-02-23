<?php
    ini_set('display_errors', 'On');
    error_reporting(E_ALL | E_STRICT);
    $ver = $_GET['v'];
    $cid = $_GET['c'];
    $username = 'root';
    $password = 'corvus';
    $conn = new mysqli('localhost', $username, $password, 'lomus');
    if($conn->connect_errno > 0){
        die('Unable to connect to database [' . $conn->connect_error . ']');
    }
    $sql = sprintf('SELECT commit_id, content, sound_url, video_url, version, r0, r1, r2, r3, r4, updated_at FROM sessions WHERE version = %u AND commit_id = %u LIMIT 1', $ver, $cid);
    if(!$result = $conn->query($sql)){
        die('There was an error running the query [' . $conn->error . ']');
    }
    $row = $result->fetch_assoc();

    echo json_encode($row);

?>
