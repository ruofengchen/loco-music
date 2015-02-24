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
        $sql = sprintf('SELECT id, name, user_name, type, district_x, district_y, lat, log, recent_commit_id FROM users WHERE id = "%s" LIMIT 1', $uid);
        if(!$result = $conn->query($sql)){
            die('There was an error running the query [' . $conn->error . ']');
        }
        $row1 = $result->fetch_assoc();
        $recent_commit_id = $row1['recent_commit_id'];
        if ($recent_commit_id) {
            $sql = sprintf('SELECT songs.title, songs.artist, s.commit_id, s.content, s.sound_url, s.video_url, s.version, s.r0, s.r1, s.r2, s.r3, s.r4, s.updated_at FROM sessions AS s JOIN commits ON s.commit_id = commits.id JOIN songs ON commits.song_id = songs.id WHERE commits.id = %u AND s.version = commits.current_version LIMIT 1', $recent_commit_id);
            if(!$result = $conn->query($sql)){
                die('There was an error running the query [' . $conn->error . ']');
            }
            $row2 = $result->fetch_assoc();
            if (!$row2) {
                echo json_encode($row1);
            }
            else {
                echo json_encode(array_merge($row1, $row2));
            }
        }
        else {
            echo json_encode($row1);
        }
    }
    else {
        echo 'need login';
    }
?>
