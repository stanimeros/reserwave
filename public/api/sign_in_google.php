<?php
    require ("connect.php");
    require ("functions.php");

    if (isset($_GET["token"])) {
        $url = 'https://www.googleapis.com/oauth2/v1/userinfo?access_token=' . urlencode($_GET["token"]);
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);

        if(curl_errno($ch)){
            $error_msg = curl_error($ch);
            curl_close($ch);
            return "Error fetching user data: $error_msg";
        }

        curl_close($ch);
        $response = json_decode($response);

        if (isset($response->email)){
            $existingUser = getUserByEmail($response->email, $conn);
            $token = getToken($existingUser, $conn);

            require('send_mail.php');
            $subject = 'Verify Your Account - Reserwave';
            $content = '<h3 style="border-bottom:1px solid #ccc;padding:5px 0;">Verify Your Account</h3>
                        <p>Thank you for registering with Reserwave!</p>
                        <p>To complete your account setup, please click on the link below to verify your email address:</p>
                        <div style="text-align:center;">
                            <a style="all:unset;width:75%;max-width:200px;margin:15px auto;background-color:#FD7F31;padding:12px 20px;display:block;text-align:center;border-radius:10px;font-weight:600;color:#fff;" href="https://reserwave.com/api/verify_email.php?email=' . $response->email . '&token=' . $token . '">Confirm your email</a>
                        </div>
                        <p>If you did not request this verification, you can safely ignore this email.</p>';

            if ($existingUser && $response->verified_email == true){

                $_SESSION['user'] = [
                    'first_name' => $existingUser['first_name'],
                    'last_name' => $existingUser['last_name'],
                    'email' => $response->email,
                    'role' => $existingUser['role'],
                    'token' => $token
                ];
                echo json_encode(['status' => 'success', 'token' => $token]);
            }else if ($existingUser && $existingUser['verified']==0){

                $_SESSION['user'] = [
                    'first_name' => $existingUser['first_name'],
                    'last_name' => $existingUser['last_name'],
                    'email' => $response->email,
                    'role' => $existingUser['role'],
                    'token' => $token
                ];
                echo json_encode(['status' => 'success', 'token' => $token]);

                sendMail($response->email, $subject, $header, $content, $footer);
            }else{
                $verified = 0;
                if ($response->verified_email){
                    $verified = 1;
                }

                $insertUserQuery = $conn->prepare("INSERT INTO users (first_name, last_name, email, token, verified) VALUES (?, ?, ?, ?, ?);");
                $insertUserQuery->bind_param("ssssi", $response->given_name, $response->family_name, $response->email, $token, $verified);

                if ($insertUserQuery->execute()) {
                    $_SESSION['user'] = [
                        'first_name' => $existingUser['first_name'],
                        'last_name' => $existingUser['last_name'],
                        'email' => $response->email,
                        'role' => 'customer',
                        'token' => $token
                    ];

                    echo json_encode(['status' => 'success']);

                    if ($verified==0){
                        sendMail($response->email, $subject, $header, $content, $footer);
                    }
                }
            }
        }
    }
    $conn->close();
?>
