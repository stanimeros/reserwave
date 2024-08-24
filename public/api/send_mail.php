<?php
    $header = '<!DOCTYPE html>
                <html lang="en">
                    <head>
                        <title>Reserwave</title>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    </head>
                    <body style="font-family:\'Inter\',sans-serif;max-width:600px;margin:0 auto;font-size:14px;line-height:1.4;">
                        <div style="background-color:#f8f8f8cf;border:1px solid #cccccc8d;border-radius:10px;overflow:hidden;margin-top:10px;">					
                            <div style="background-color:#eee9;padding:5px 20px;text-align:center;outline:1px solid #00000010;">
                                <img height=60 width=60 src="https://reserwave.com/images/reserwave/logo512_transparent.png">
                            </div>
                            <div style="padding:0 20px;">';

    $footer = '</div></div><br>
                <div style="background-color:#f8f8f8;padding:10px 10px;font-size:12px;color:#aaa;max-width:600px;border-radius:10px;">
                    <p style="border-top:1px solid #ccc;padding:20px 0 10px 0;">
                        You have received this email as you are registered at Reserwave. Use of the service and website is subject to our <a style="color:#aaa" href="https://reserwave.com/terms-and-conditions">Terms and Conditions</a> and <a style="color:#aaa" href="https://reserwave.com/privacy-policy">Privacy Policy</a>.
                    </p>
                    <table style="width:100%">
                        <tr>
                            <td style="color:#aaa;font-size:11px;width:60%;text-align:left;">© 2024 Reserwave - All rights reserved</td>
                            <td style="width:40%;text-align:center;">
                                <a style="padding:0 6px;" href="https://www.facebook.com/"><img width=24 src="https://reserwave.com/images/icons/facebook_icon.png"></a>
                                <a style="padding:0 6px;" href="https://www.instagram.com/reserwave"><img width=24 src="https://reserwave.com/images/icons/instagram_icon.png"></a>
                                <a style="padding:0 6px;" href="https://twitter.com/"><img width=24 src="https://reserwave.com/images/icons/x_icon.png"></a>
                            </td>
                        </tr>
                    </table>
                </div>
            </body>
        </html>';

    

    function sendMail($to, $subject, $header, $content, $footer) {
        return sendSMTPTitanMail($to, $subject, $header, $content, $footer);
    }  

    function sendPHPMail($to, $subject, $header, $content, $footer) {
        $headers = 'From: Reserwave <no-reply@reserwave.com>' . "\r\n" .
            'Reply-To: hello@reserwave.com' . "\r\n" .
            'X-Mailer: PHP/' . phpversion() . "\r\n" .
            'Return-Path: hello@reserwave.com' . "\r\n" .
            'Content-Type: text/html; charset=UTF-8' . "\r\n";

        $body = $header . $content . $footer;

        try{
            $current_url = $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
            if (strpos($current_url, 'localhost') === false) {
                // Not on localhost, so send the email
                return mail($to, $subject, $body, $headers);
            }
        }catch (Exception $e) {
            echo "Mailer Error: {$mail->ErrorInfo}";
        }
        return false;
    }  

    function sendSMTPTitanMail($to, $subject, $header, $content, $footer) {
        if (!file_exists('/home/u321831237/domains/stanimeros.com/public_html/vendor/autoload.php')) {
            return false;
        }
        
        require '/home/u321831237/domains/stanimeros.com/public_html/vendor/autoload.php';
        try {
            //Server settings
            $mail = new \PHPMailer\PHPMailer\PHPMailer(true);
            $mail->isSMTP();
            $mail->Host       = 'mail.reserwave.com';
            $mail->SMTPAuth   = true;
            $mail->Username   = 'no-reply@reserwave.com';
            $mail->Password   = '_&UJn}sh=~Je';
            $mail->SMTPSecure = 'tls';
            $mail->Port       = 587;

            $mail->setFrom('no-reply@reserwave.com', 'Reserwave');
            $mail->addReplyTo('hello@reserwave.com', 'Reserwave');
            $mail->addAddress($to);

            $mail->CharSet = 'UTF-8';
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body    = $header . $content . $footer;

            return $mail->send();
        } catch (Exception $e) {
            echo "Mailer Error: {$mail->ErrorInfo}";
        }
        return false;
    }  
?>
