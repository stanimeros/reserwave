<?php
    //CRON JOB HOSTINGER
    //domains/reserwave.com/public_html/api/mail_campaign.php campaign=1
    require ("connect.php");
    require ("functions.php");
    require('send_mail.php');
    
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    
    parse_str($argv[1], $params);
    
    if (isset($params['campaign'])){
        $campaign = intval($params['campaign']);

        $sql = "SELECT emails.email
                FROM emails
                WHERE NOT EXISTS (
                    SELECT 1
                    FROM campaigns
                    WHERE emails.email = campaigns.email AND campaigns.campaign = ?)
                LIMIT 10;";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $campaign);
        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();
    
        $emails = array();
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()){
                $emails[] = $row;
            }
        }
    
        if ($campaign == 1){
            $subject = 'Γνωρίστε το Reserwave';
            $content = '<h3 style="border-bottom:1px solid #ccc;padding:5px 0;">Γνωρίστε το Reserwave</h3>
            <h4>Βασικά Χαρακτηριστικά:</h4>
            <ol>
                <li><strong>Μηχανή Αναζήτησης Καταστημάτων:</strong> Η πλατφόρμα διαθέτει μια ισχυρή μηχανή αναζήτησης που επιτρέπει στους χρήστες να εντοπίζουν γρήγορα και εύκολα το κατάστημά σας βάσει της τοποθεσίας τους.</li>
                <li><strong>Σύστημα Κρατήσεων:</strong> Παρέχει ένα αξιόπιστο σύστημα κρατήσεων που επιτρέπει στους πελάτες σας να κλείνουν ραντεβού με άνεση, ενισχύοντας την εμπειρία αγοράς τους.</li>
            </ol>
            <p>Για περιορισμένο χρονικό διάστημα, προσφέρουμε δωρεάν συνδρομή για τους πρώτους τρεις μήνες. Επωφεληθείτε από αυτήν την ευκαιρία για να δοκιμάσετε τα οφέλη του Reserwave χωρίς κανένα κόστος.</p>      
            <p>Για περαιτέρω πληροφορίες ή για να εγγραφείτε, μην διστάσετε να επικοινωνήσετε μαζί μας στο <a href="mailto:hello@reserwave.com">hello@reserwave.com</a> .</p>
            <p>Ευχαριστούμε για τον χρόνο σας και ανυπομονούμε να συνεργαστούμε μαζί σας.</p>
            <p>Με εκτίμηση,</p>
            <p>Η ομάδα του Reserwave</p>';
                        
            $footer = '</div></div><br>
                <div style="background-color:#f8f8f8;padding:10px 10px;font-size:12px;color:#aaa;max-width:600px;border-radius:10px;">
                    <p style="border-top:1px solid #ccc;padding:20px 0 10px 0;">
                        Use of the service and website is subject to our <a style="color:#aaa" href="https://reserwave.com/terms-and-conditions">Terms and Conditions</a> and <a style="color:#aaa" href="https://reserwave.com/privacy-policy">Privacy Policy</a>.
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
        }
    
    
        foreach ($emails as $email) {
            $sent = 0;
            // echo 'Trying to ' . $email['email'];
            if(sendMail($email['email'], $subject, $header, $content, $footer)){
                $sent = 1;
            }

            sleep(3);
    
            $sql = "INSERT INTO campaigns (campaign, email, sent) VALUES (?, ?, ?);";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("isi",$campaign, $email['email'], $sent);
            $stmt->execute();
            $stmt->close();
    
        }
    }else{
        echo 'No Campaign Parameter';
    }


    $conn->close();
?>
