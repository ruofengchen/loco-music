<?php

    function l2sq($x1, $y1, $x2, $y2) {
        return ($x1-$x2)*($x1-$x2) + ($y1-$y2)*($y1-$y2);
    }

    ini_set('display_errors', 'On');
    error_reporting(E_ALL | E_STRICT);
    $lat_new = $_GET['lat'];
    $log_new = $_GET['log'];
    $zip_old = $_GET['zipold'];

    $username = 'root';
    $password = 'corvus';
    $conn = new mysqli('localhost', $username, $password, 'lomus');
    if($conn->connect_errno > 0){
        die('Unable to connect to database [' . $conn->connect_error . ']');
    }

    $sql = 'SELECT zipcode, log, lat FROM zipcodes';
    
    if(!$result = $conn->query($sql)){
        die('There was an error running the query [' . $conn->error . ']');
    }

    $mindist = 99999999;
    $minzip = 0;
    while($row = $result->fetch_assoc()){
        $zip = (int) $row['zipcode'];
        $log = (float) $row['log'];
        $lat = (float) $row['lat'];
        $dist = l2sq($log, $lat, $log_new, $lat_new);
        if ($dist < $mindist) {
            $mindist = $dist;
            $minzip = $zip;
        }
    }

    if ($minzip != $zip_old) {

        $sql = 'SELECT id, user_name FROM users WHERE zip = ' . $minzip ;
        if(!$result = $conn->query($sql)){
            die('There was an error running the query [' . $conn->error . ']');
        }

        $users = array();
        while($row = $result->fetch_assoc()){
            $users[] = $row;
        }
        $sql = 'SELECT log, lat FROM zipcodes WHERE zipcode = ' . $minzip . ' LIMIT 1';
        if(!$result = $conn->query($sql)){
            die('There was an error running the query [' . $conn->error . ']');
        }
        $row = $result->fetch_assoc();
        $ret['users'] = $users;
        $ret['zip'] = $minzip;
        $ret['log'] = $row['log'];
        $ret['lat'] = $row['lat'];
        echo json_encode($ret);
    }
    else {
        echo "no need update";
    }
?>
