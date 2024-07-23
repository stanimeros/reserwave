<?php
    require ("connect.php");

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $json_data = file_get_contents('php://input');
        $data = json_decode($json_data, true);

        $inputName = $data['name'];
        $inputEmail = $data['email'];

        require('send_mail.php');
        $to = 'pantelisstanimeros@gmail.com';
        $subject = 'New Partner - Reserwave';
        $content = '<h3 style="border-bottom:1px solid #ccc;padding:5px 0;">Requiring Presentation</h3>
                <p>Details below:</p>
                <table style="width:100%;">
                    <tr>
                        <th style="text-align:left;width:40%;">Name</th>
                        <td style="text-align:left;width:60%;">' . $inputName . '</td>
                    </tr>
                    <tr>
                        <th style="text-align:left;width:40%;">Email</th>
                        <td style="text-align:left;width:60%;"><a href="mailto:' . $inputEmail .'">' . $inputEmail .'</a></td>
                    </tr>
                </table>';
                sendMail($to, $subject, $header, $content, $footer);

        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'failed', 'message' => 'Invalid request method']);
    }
    $conn->close();
?>
