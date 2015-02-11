<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);

// basic headers
header("Content-type: image/jpg");
//header("Expires: Mon, 1 Jan 2099 05:00:00 GMT");
//header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
//header("Cache-Control: no-store, no-cache, must-revalidate");
//header("Cache-Control: post-check=0, pre-check=0", false);
//header("Pragma: no-cache");
 
// get the size for content length
$username = $_GET["n"];
$filename = '/home/lomus/avatars/' . $username . '.jpg';
$size = filesize($filename);
header("Content-Length: $size bytes");
 
// output the file contents
readfile($filename);
 
?>
