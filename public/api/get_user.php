<?php
    require ("connect.php");
    require ("functions.php");

    if (isset($_SESSION['user'])) {
        $token = $_SESSION['user']['token'];
    } elseif (isset($_GET["token"])) {
        $token = $_GET["token"];
    } else {
        exit('No token provided.');
    }

    $user = getUser($token, $conn);
    $favourites = getFavourites($token, $conn);

    if (empty($favourites)){
        $user['favourites'] = [];
    }else{
        $user['favourites'] = $favourites;
    }
    
    echo json_encode($user);
    $conn->close();
?>

