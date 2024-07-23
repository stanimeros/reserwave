<?php
    require ("connect.php");
    require ("functions.php");

    if (isset($_GET["reservationCode"])) {
        $sql = "UPDATE store_reservations AS sr
        JOIN stores ON sr.store_id = stores.id
        SET 
            sr.cancelled = 1,
            sr.cancelled_datetime = CONVERT_TZ(NOW(), @@session.time_zone, stores.timezone)
        WHERE
            sr.code = ?;";
        
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $_GET["reservationCode"]);
        $stmt->execute();
        
        $result = $stmt->get_result();

        $numRowsAffected = $stmt->affected_rows;
        if ($numRowsAffected>0){
            echo json_encode(['status' => 'success']);

            $reservationQuery = $conn->prepare("SELECT GROUP_CONCAT(store_services.title ORDER BY store_reservations.id ASC SEPARATOR ' & ') AS service_title, 
            MIN(store_reservations.time) AS time , users.first_name, users.last_name ,   store_reservations.code, SUM(store_services.price) as price,
            DATE_FORMAT(MIN(store_reservations.date), '%d/%m/%y') AS date, stores.title AS store_title, MIN(store_reservations.cancelled) AS cancelled, 
            store_reservations.cancelled_datetime,  users.email, stores.admin_id, admins.email AS admin_email
            FROM users INNER JOIN store_reservations ON users.id = store_reservations.user_id 
            INNER JOIN store_services ON store_reservations.service_id=store_services.id
            INNER JOIN stores ON store_reservations.store_id = stores.id 
            INNER JOIN services ON services.slug=stores.service_slug
            INNER JOIN users AS admins ON admins.id = stores.admin_id
            WHERE store_reservations.code=?
            GROUP BY store_reservations.code;");

            $reservationQuery->bind_param("s", $_GET["reservationCode"]);
            $reservationQuery->execute();
            $reservation = $reservationQuery->get_result()->fetch_assoc();

            $cancelledDatetime = new DateTime($reservation['cancelled_datetime']);
            $formattedCancelledDatetime = $cancelledDatetime->format('H:i d/m/Y');

            $reservationDetails = '<table style="width:100%;">
                <tr>
                    <th style="text-align:left;width:40%;">Name</th>
                    <td style="text-align:left;width:60%;">' . $reservation['last_name'] . ' ' . $reservation['first_name'] . '</td>
                </tr>
                <tr>
                    <th style="text-align:left;width:40%;">Service</th>
                    <td style="text-align:left;width:60%;">' . $reservation['service_title'] . '</td>
                </tr>
                <tr>
                    <th style="text-align:left;width:40%;">Time</th>
                    <td style="text-align:left;width:60%;">' . substr($reservation['time'], 0, 5) . '</td>
                </tr>
                <tr>
                    <th style="text-align:left;width:40%;">Date</th>
                    <td style="text-align:left;width:60%;">' . $reservation['date'] . '</td>
                </tr>
                <tr>
                    <th style="text-align:left;width:40%;">Place</th>
                    <td style="text-align:left;width:60%;">' . $reservation['store_title'] . '</td>
                </tr>
                <tr>
                    <th style="text-align:left;width:40%;">Reservation ID</th>
                    <td style="text-align:left;width:60%;">' . $reservation['code'] . '</td>
                </tr>
                <tr>
                    <th style="text-align:left;width:40%;">Cancelled at</th>
                    <td style="text-align:left;width:60%;">' . $formattedCancelledDatetime . '</td>
                </tr>';
                

            if ((double) $reservation['price'] > 0){ 
                $reservationDetails .= '
                <br>
                <tr>
                    <th style="text-align:left;width:40%;">Total ' . $reservation['price'] . '€</th>
                 </tr>';
            }

            $reservationDetails .= '</table>';

            require('send_mail.php');
            $subject = 'Reservation Cancellation - ' . $reservation['code'];
            $content = '<h3 style="border-bottom:1px solid #ccc;padding:5px 0;">Reservation Cancellation</h3>
                        <p>We regret to inform you that your reservation with Reserwave has been canceled. Below are the details:</p>
                        ' . $reservationDetails . '
                        <br>
                        <p>If you have any questions or concerns, please feel free to reach out to us.</p>';

            //Customer Email
            sendMail($reservation['email'], $subject, $header, $content, $footer);
            //Admin Email
            sendMail($reservation['admin_email'], $subject, $header, $content, $footer);
        }else{
            echo json_encode(['status' => 'failed']);
        }

        $stmt->close();
    } 
    $conn->close();
?>

