<?php
    $current_url = $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
    if (strpos($current_url, 'localhost') !== false) {

        if (isset($_SERVER['HTTP_ORIGIN'])){
            header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        }
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');
        header("Access-Control-Allow-Methods: GET, POST, UPDATE, OPTIONS");
        header("Access-Control-Expose-Headers: *");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        header("Content-Length: 0");
        header("Content-Type: text/plain");

        error_reporting(E_ALL);
        ini_set('display_errors', 1);
    }
?>