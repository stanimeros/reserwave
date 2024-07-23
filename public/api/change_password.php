<?php
    require ("connect.php");
    require ("functions.php");

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $json_data = file_get_contents('php://input');
        $data = json_decode($json_data, true);

        $token = $data['token'];
        $password = $data['password'];

        $user = getUser($token, $conn);
        
        if ($user) {
            $token = refreshToken($user, $conn);

            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

            $sql = "UPDATE users 
            SET password = ?
            WHERE id = ?;";
    
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("si", $hashedPassword, $user['id']);
            $stmt->execute();
            $stmt->close();

            session_unset();
            session_destroy();
            echo json_encode(['status' => 'success']);
        }
    } else {
        echo json_encode(['status' => 'failed', 'message' => 'Invalid request method']);
    }
    $conn->close();
?>
