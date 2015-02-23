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
    $sql = sprintf('SELECT songs.title, songs.artist, s.content, s.sound_url, s.video_url, s.version, s.r0, s.r1, s.r2, s.r3, s.r4, s.updated_at FROM sessions AS s JOIN commits ON s.commit_id = commits.id JOIN songs ON commits.song_id = songs.id WHERE commits.author_id = %u AND s.version = commits.current_version LIMIT 1', $uid);
    if(!$result = $conn->query($sql)){
        die('There was an error running the query [' . $conn->error . ']');
    }
    $row = $result->fetch_assoc();

    echo json_encode($row);

?>
