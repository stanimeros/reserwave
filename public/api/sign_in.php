<?php
    require ("connect.php");
    require ("functions.php");

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $json_data = file_get_contents('php://input');
        $data = json_decode($json_data, true);

        $inputEmail = $data['email'];
        $inputPassword = $data['password'];

        $user = getUserByEmail($inputEmail, $conn);

        if ($user && password_verify($inputPassword, $user['password'])) {

            $token = getToken($user, $conn);

            $_SESSION['user'] = [
                'first_name' => $user['first_name'],
                'last_name' => $user['last_name'],
                'email' => $user['email'],
                'role' => $user['role'],
                'token' => $token
            ];

            echo json_encode(['status' => 'success', 'token' => $token]);
        } else {
            echo json_encode(['status' => 'failed', 'message' => 'Invalid credentials']);
        }
    } else {
        echo json_encode(['status' => 'failed', 'message' => 'Invalid request method']);
    }
    $conn->close();
?>
