<?php

    function generateRandomString($length = 10) {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }

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
    $sql = sprintf('SELECT id, name, user_name, type, district_x, district_y, lat, log, passwd_salt, recent_commit_id FROM users WHERE user_name = "%s" LIMIT 1', $un);
    if(!$result = $conn->query($sql)){
        die('There was an error running the query [' . $conn->error . ']');
    }
    $row1 = $result->fetch_assoc();
    if(!$row1 || $pw!=$row1['passwd_salt']) {
        echo "login failure";
    } 
    else { 
        unset($row1['passwd_salt']);        

        // session
        session_start();
        $randStr = generateRandomString();
        while (isset($_SESSION[$randStr])) {
            $randStr = generateRandomString();
        }
        $_SESSION[$randStr] = $row1['id'];
        $row1['token'] = $randStr;
        $recent_commit_id = $row1['recent_commit_id'];

        if ($recent_commit_id) {
            $sql = sprintf('SELECT songs.title, songs.artist, s.commit_id, s.content, s.sound_url, s.video_url, s.version, s.r0, s.r1, s.r2, s.r3, s.r4, s.updated_at FROM sessions AS s JOIN commits ON s.commit_id = commits.id JOIN songs ON commits.song_id = songs.id WHERE commits.id = %u AND s.version = commits.current_version LIMIT 1', $recent_commit_id);
            if(!$result = $conn->query($sql)){
                die('There was an error running the query [' . $conn->error . ']');
            }
            $row2 = $result->fetch_assoc();
            if (!$row2) {
                echo json_encode($row1); // data inconsistent
            }
            else {
                echo json_encode(array_merge($row1, $row2));
            }
        }
        else {
            echo json_encode($row1);
        }
    }
