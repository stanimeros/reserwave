<?php
    $current_url = $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
    if (strpos($current_url, 'localhost') !== false) {
        exit;
    }

    $ip = $_SERVER['REMOTE_ADDR'];
    $response = file_get_contents("http://ipinfo.io/{$ip}/json?token=c7d36e70f0e708");
    echo $response;
?>
