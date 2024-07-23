<?php
	header('Content-Type: application/json');
    require ("connect.php");
    require ("functions.php");
    
    if (verifyToken('', $conn)) {
        echo json_encode(['authenticated' => true]);
    } else {
        echo json_encode(['authenticated' => false]);
    }

    $conn->close();
?>