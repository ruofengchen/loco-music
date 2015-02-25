<?php

    ini_set('display_errors', 'On');
    error_reporting(E_ALL | E_STRICT);
    $cid = $_GET['cid'];
    $v =$_GET['v'];
    $video = $_FILES['video'];
    $output_path = '/home/lomus/videos/';
    $output_name = $cid . '_' . $v;
    if (file_exists($output_path . $output_name)){
       echo "file exists";
    }

    if (!move_uploaded_file($video['tmp_name'], $output_path . $output_name)) {
        echo "permission denied";
    }

    $username = 'root';
    $password = 'corvus';
    $conn = new mysqli('localhost', $username, $password, 'lomus');
    if($conn->connect_errno > 0){
        die('Unable to connect to database [' . $conn->connect_error . ']');
    }

    $sql = sprintf('INSERT INTO sessions (commit_id, version, video_url) VALUES (%u, %u, "%s");', $cid, $v, $output_path . $output_name);

    $sql .= sprintf('UPDATE commits SET current_version = %u WHERE id = %u;', $v, $cid);

    if(!$result = $conn->multi_query($sql)){
        die('There was an error running the query [' . $conn->error . ']');
    }

    echo "upload successful";
?>
