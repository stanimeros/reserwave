<?php
    require ("connect.php");

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Unset and destroy the session to log the user out
        session_unset();
        session_destroy();
        echo json_encode(['status' => 'success']);
    } else {
        // If the request is not a POST request, return an error
        echo json_encode(['status' => 'failed', 'message' => 'Invalid request method']);
    }
    $conn->close();
?>
