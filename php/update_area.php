<?php

    function l2sq($x1, $y1, $x2, $y2) {
        return ($x1-$x2)*($x1-$x2) + ($y1-$y2)*($y1-$y2);
    }

    ini_set('display_errors', 'On');
    error_reporting(E_ALL | E_STRICT);
    $district_x = $_GET['dx'];
    $district_y = $_GET['dy'];
    $curr_district_x = $_GET['cdx'];
    $curr_district_y = $_GET['cdy'];
    if ($district_x == $curr_district_x && $district_y == $curr_district_y) {
        echo "no need update";
    }
    else {

        $username = 'root';
        $password = 'corvus';
        $conn = new mysqli('localhost', $username, $password, 'lomus');
        if($conn->connect_errno > 0){
            die('Unable to connect to database [' . $conn->connect_error . ']');
        }


        $sql = 'SELECT id, name, user_name, log, lat, type FROM users WHERE district_x >= ' . ($district_x-1) . ' AND district_x <= ' . ($district_x+1) . ' AND district_y >= ' . ($district_y-1) . ' AND district_y <= ' . ($district_y+1);
        if(!$result = $conn->query($sql)){
            die('There was an error running the query [' . $conn->error . ']');
        }

        $users = array();
        while($row = $result->fetch_assoc()){
            $users[$row['id']] = $row;
        }
        echo json_encode($users);
    }
?>
