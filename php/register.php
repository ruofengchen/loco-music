<?php


    ini_set('display_errors', 'On');
    error_reporting(E_ALL | E_STRICT);
    $un = $_GET['un'];
    $pw = $_GET['pw'];
    $dn = $_GET['dn'];
    $em = $_GET['em'];
    $inst = $_GET['inst'];
    $lat = $_GET['lat'];
    $log = $_GET['log'];
    $username = 'root';
    $password = 'corvus';
    $conn = new mysqli('localhost', $username, $password, 'lomus');
    if($conn->connect_errno > 0){
        die('Unable to connect to database [' . $conn->connect_error . ']');
    }

    $district_res = 0.1;
    $dx = intval(floatval($lat) / $district_res);
    $dy = intval(floatval($log) / $district_res);

    $sql = sprintf('INSERT INTO users (user_name, name, email, type, district_x, district_y, lat, log, passwd_salt) VALUES ("%s", "%s", "%s", "%s", %d, %d, %f, %f, "%s")', $un, $dn, $em, $inst, $dx, $dy, $lat, $log, $pw);
    if(!$result = $conn->query($sql)){
        die('There was an error running the query [' . $conn->error . ']');
    }
    echo "register success";
?>
