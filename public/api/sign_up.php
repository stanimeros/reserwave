<?php
    require ("connect.php");
    require ("functions.php");

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $json_data = file_get_contents('php://input');
        $data = json_decode($json_data, true);

        $firstName = $data['firstName'];
        $lastName = $data['lastName'];
        $inputEmail = $data['email'];
        $inputPhone = $data['phone'];
        $inputPassword = $data['password'];

        $existingUser = getUserByEmailOrPhone($inputEmail, $inputPhone, $conn);

        if ($existingUser) {
            echo json_encode(['status' => 'failed', 'message' => 'Email or phone already exists']);
        } else {
            $hashedPassword = password_hash($inputPassword, PASSWORD_DEFAULT);
            $randomToken = bin2hex(random_bytes(16));
            $insertUserQuery = $conn->prepare("INSERT INTO users (first_name, last_name, email, phone, password, token) VALUES (?, ?, ?, ?, ?, ?);");
            $insertUserQuery->bind_param("ssssss", $firstName, $lastName, $inputEmail, $inputPhone, $hashedPassword, $randomToken);

            if ($insertUserQuery->execute()) {
                $_SESSION['user'] = [
                    'first_name' => $firstName,
                    'last_name' => $lastName,
                    'email' => $inputEmail,
                    'role' => 'customer',
                    'token' => $randomToken
                ];

                echo json_encode(['status' => 'success']);

                require('send_mail.php');
                $subject = 'Verify Your Account - Reserwave';
                $content = '<h3 style="border-bottom:1px solid #ccc;padding:5px 0;">Verify Your Account</h3>
                            <p>Thank you for registering with Reserwave!</p>
                            <p>To complete your account setup, please click on the link below to verify your email address:</p>
                            <div style="text-align:center;">
                                <a style="all:unset;width:75%;max-width:200px;margin:15px auto;background-color:#FD7F31;padding:12px 20px;display:block;text-align:center;border-radius:10px;font-weight:600;color:#fff;" href="https://reserwave.com/api/verify_email.php?email=' . $inputEmail . '&token=' . $randomToken . '">Confirm your email</a>
                            </div>
                            <p>If you did not request this verification, you can safely ignore this email.</p>';
                            sendMail($inputEmail, $subject, $header, $content, $footer);
            } else {
                echo json_encode(['status' => 'failed', 'message' => 'Registration failed']);
            }
            $insertUserQuery->close();
        }

        $checkUsernameQuery->close();
    } else {
        echo json_encode(['status' => 'failed', 'message' => 'Invalid request method']);
    }
    $conn->close();
?>
