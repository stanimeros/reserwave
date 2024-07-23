<?php
    require ("connect.php");
    require ("functions.php");

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $json_data = file_get_contents('php://input');
        $data = json_decode($json_data, true);

        $phone = '';
        $email = $data['email'];
        $user = getUserByEmailOrPhone($email, $phone, $conn);

        if ($user) {
            $token = refreshToken($user, $conn);
            require('send_mail.php');
            $subject = 'Password Recovery - Reserwave';
            $content = '<h3 style="border-bottom:1px solid #ccc;padding:5px 0;">Password Recovery</h3>
                        <p>We have received a request to reset the password for your Reserwave account.</p>
                        <p>To reset your password, click on the link below:</p>
                        <div style="text-align:center;">
                            <a style="all:unset;width:75%;max-width:200px;margin:15px auto;background-color:#FD7F31;padding:12px 20px;display:block;text-align:center;border-radius:10px;font-weight:600;color:#fff;" href="https://reserwave.com/forgot/?token=' . $token . '">Change your password</a>
                        </div>
                        <p>If you did not make this request, please ignore this email.</p>';
            sendMail($user['email'], $subject, $header, $content, $footer);
            echo json_encode(['status' => 'success']);
        }
    } else {
        echo json_encode(['status' => 'failed', 'message' => 'Invalid request method']);
    }
    $conn->close();
?>
