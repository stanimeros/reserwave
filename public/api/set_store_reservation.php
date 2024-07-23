<?php
    require ("connect.php");
    require ("functions.php");

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $json_data = file_get_contents('php://input');
        $data = json_decode($json_data, true);
        
        if ($data !== null) {
            $serviceIds = $data['serviceIds'];
            $request_date = $data['date'];
            $request_time = $data['time'];
            $store = getStore($data['storeId'], $conn);
            $user = getUser($data['token'], $conn);

            $validPermutation = true;
            $autoAccept = true;
            $reservationName = '';
            $reservationPrice = 0;
            
            foreach (generatePermutations($serviceIds) as $permutation) {
                $validPermutation = true;
                $stringToHash  = $user['id'] . '_' . $permutation[0] . '_' . $store['id'] . '_' . $request_date . '_' . $request_time;
                $hashedString  = md5($stringToHash);
                $code = strtoupper(substr($hashedString, 0, 8));
                $request_start_time = date('H:i', strtotime($request_time));
                $reservationName = '';
                $reservationPrice = 0;

                foreach ($permutation as $serviceId) {
                    $service = getService($serviceId, $store['id'], $conn);
    
                    $request_end_time = date('H:i', strtotime("$request_start_time + {$service['duration']} minutes"));
    
                    $validPermutation = createReservation($service, $store, $user, $request_date, $request_start_time, $request_end_time, $code, $conn);
    
                    if ($service['auto_accept']==0){
                        $autoAccept = false;
                    }

                    if ($reservationName!=''){
                        $reservationName .= ' & ';
                    }
                    $reservationName .= $service['title'];

                    $reservationPrice += (double) $service['price'];

                    if ($validPermutation==false){
                        break;
                    }
    
                    $request_start_time = $request_end_time;
                }

                if ($validPermutation){
                    break;
                }
            }

            if ($validPermutation){
                verifyReservations($store, $user, $code, $conn);
                prepareEmail($user, $code, $request_date, $request_time, $store, $reservationName, $reservationPrice, $autoAccept, $conn);
                echo json_encode(['status' => 'success']);
            }else{
                echo json_encode(['status' => 'conflict_found']);
            }
        } else {
            echo json_encode(['status' => 'failed', 'message' => 'Invalid JSON data']);
        }
    } else {
        echo json_encode(['status' => 'failed', 'message' => 'Method not allowed']);
    }
    $conn->close();

    function createReservation($service, $store, $user, $request_date, $request_start_time, $request_end_time, $code, $conn){

        validateReservation($user, $request_date, $request_start_time, $request_end_time, $conn);

        if ($service['concurrent']>0){
            $sql = "INSERT INTO store_reservations (code, store_id, service_id, date, time, user_id, accepted, accepted_datetime)
            SELECT ?, ?, ?, ?, ?, ?, ?, CONVERT_TZ(NOW(),@@session.time_zone, ?)
            WHERE 
            (
                (
                    (?) >
                    (SELECT COUNT(*) FROM store_reservations
                    WHERE
                        (
                            (? >= time AND ? <= ADDTIME(time, SEC_TO_TIME(? * 60)))
                            OR (? > time AND ? < ADDTIME(time, SEC_TO_TIME(? * 60)))
                        )
                        AND store_id = ?
                        AND service_id = ?
                        AND date = ?
                        AND cancelled = 0
                        AND verified = 1
                    )
                ) = 1
            ) AND (CONCAT(?, ' ', ?) >= CONVERT_TZ(NOW(),@@session.time_zone, ?));";

            $stmt = $conn->prepare($sql);
            $stmt->bind_param("siissiisississiiissss", $code, $store['id'], $service['id'], $request_date, $request_start_time, $user['id'], $service['auto_accept'], $store['timezone'],
            $service['concurrent'], $request_start_time, $request_start_time, $service['duration'],
            $request_end_time, $request_end_time, $service['duration'],$store['id'], $service['id'],
            $request_date,$request_date,$request_start_time,$store['timezone']);
            $stmt->execute();
        }else{
            $sql = "INSERT INTO store_reservations (code, store_id, service_id, date, time, user_id, accepted, accepted_datetime)
            SELECT ?, ?, ?, ?, ?, ?, ?, CONVERT_TZ(NOW(),@@session.time_zone, ?)
            WHERE 
            (
                (
                    (SELECT concurrent FROM stores WHERE id=?) >
                    (SELECT COUNT(*) FROM store_reservations
                    WHERE
                        (
                            (? >= time AND ? <= ADDTIME(time, SEC_TO_TIME(? * 60)))
                            OR (? > time AND ? < ADDTIME(time, SEC_TO_TIME(? * 60)))
                        )
                        AND store_id = ?
                        AND date = ?
                        AND cancelled = 0
                        AND verified = 1
                    )
                ) = 1
            ) AND (CONCAT(?, ' ', ?) >= CONVERT_TZ(NOW(),@@session.time_zone, ?));";

            $stmt = $conn->prepare($sql);
            $stmt->bind_param("siissiisississiissss", $code, $store['id'], $service['id'], $request_date, $request_start_time, $user['id'], $service['auto_accept'], $store['timezone'],
            $store['id'], $request_start_time, $request_start_time, $service['duration'],
            $request_end_time, $request_end_time, $service['duration'], $store['id'], $request_date,$request_date,$request_start_time,$store['timezone']);
            $stmt->execute();
        }
        
        $numRowsAffected = $stmt->affected_rows;
        $stmt->close();
        if ($numRowsAffected>0){
            return true;
        }else{
            return false;
        }
    }

    function validateReservation($user, $request_date, $request_start_time, $request_end_time, $conn){
        verifyUser($user, $conn);
        accountConcurrentReservation($user, $request_date, $request_start_time, $request_end_time, $conn);
    }

    function accountConcurrentReservation($user, $request_date, $request_start_time, $request_end_time, $conn){
        $query = $conn->prepare("SELECT * FROM store_reservations WHERE user_id = ? AND date = ? AND cancelled = 0;");
        $query->bind_param("is", $user['id'], $request_date);
        $query->execute();
        $results = $query->get_result();

        $active_reservations = 0;
        
        while ($reservation = $results->fetch_assoc()) {
            $reservationTime = date('H:i', strtotime($reservation['time']));

            if ($reservationTime >= $request_start_time && $reservationTime<$request_end_time) {
                $active_reservations += 1;
                echo json_encode(['status' => 'active_reservation']);
                $conn->close();
                exit;
            }
        }
    }

    function verifyReservations($store, $user, $code, $conn){

        $sql = "UPDATE store_reservations SET verified = 1 
                WHERE store_id = ? AND user_id = ? AND code = ?";
        
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("iis", $store['id'], $user['id'], $code);
        $stmt->execute();
        $stmt->close();
    }
    
    function prepareEmail($user, $code, $request_date, $request_time, $store, $reservationName, $reservationPrice, $autoAccept, $conn){
        require('send_mail.php');
        $subject = '';
        $content = '';

        $formattedDate = date("d/m/Y", strtotime($request_date));

        $reservationDetails = '<table style="width:100%;">
        <tr>
            <th style="text-align:left;width:40%;">Name</th>
            <td style="text-align:left;width:60%;">' . $user['last_name'] . ' ' . $user['first_name'] . '</td>
        </tr>
        <tr>
            <th style="text-align:left;width:40%;">Service</th>
            <td style="text-align:left;width:60%;">' . $reservationName . '</td>
        </tr>
        <tr>
            <th style="text-align:left;width:40%;">Time</th>
            <td style="text-align:left;width:60%;">' . $request_time . '</td>
        </tr>
        <tr>
            <th style="text-align:left;width:40%;">Date</th>
            <td style="text-align:left;width:60%;">' . $formattedDate . '</td>
        </tr>
        <tr>
            <th style="text-align:left;width:40%;">Place</th>
            <td style="text-align:left;width:60%;">' . $store['title'] . '</td>
        </tr>
        <tr>
            <th style="text-align:left;width:40%;">Reservation ID</th>
            <td style="text-align:left;width:60%;">' . $code . '</td>
        </tr>';
        

    if ((double) $reservationPrice > 0){ 
        $reservationDetails .= '
        <br>
        <tr>
            <th style="text-align:left;width:40%;">Total ' . $reservationPrice . '€</th>
        </tr>';
    }

        $reservationDetails .= '</table>';

        if ($autoAccept){
            $subject = 'Reservation Confirmation - ' . $code;
            $content = '<h3 style="border-bottom:1px solid #ccc;padding:5px 0;">Reservation Confirmation</h3>
                    <p>Your reservation with Reserwave has been successfully confirmed. Below are the details:</p>
                    '. $reservationDetails .'
                    <br>    
                    <p>If you have any questions or need to make changes, please contact us.</p>';
        }else{
            $subject = 'Pending Confirmation - ' . $code;
            $content = '<h3 style="border-bottom:1px solid #ccc;padding:5px 0;">Pending Confirmation</h3>
                    <p>We wanted to inform you that a reservation has been made on Reserwave but is currently pending confirmation by our team. Here are the details:</p>
                    '. $reservationDetails .'
                    <br>    
                    <p>Once the reservation is confirmed by our team, you will receive a confirmation email with all the details. If you have any questions or concerns in the meantime, please feel free to contact us.</p>
                    <p>Thank you for your patience.</p>';
        }

        //Customer Email
        sendMail($user['email'], $subject, $header, $content, $footer);

        if ($autoAccept){
            $subject = 'New Reservation - ' . $code;
            $content = '<h3 style="border-bottom:1px solid #ccc;padding:5px 0;">New Reservation</h3>
                    <p>A new reservation has been made on Reserwave. Here are the details:</p>
                    '. $reservationDetails .'
                    <br>    
                    <p>Please review and manage this reservation accordingly.</p>';
        }else{
            $subject = 'Pending Confirmation - ' . $code;
            $content = '<h3 style="border-bottom:1px solid #ccc;padding:5px 0;">Pending Confirmation</h3>
                    <p>A new reservation has been made on Reserwave. Here are the details:</p>
                    '. $reservationDetails .'
                    <br>    
                    <p>Please review and manage this reservation accordingly.</p>';
        }

        //Admin Email
        sendMail(getUserEmail($store['admin_id'], $conn), $subject, $header, $content, $footer);
    }

    function generatePermutations($items, $permutation = []) {
        if (empty($items)) {
            yield $permutation;
        } else {
            for ($i = count($items) - 1; $i >= 0; --$i) {
                $newItems = $items;
                $newPermutation = $permutation;
                list($item) = array_splice($newItems, $i, 1);
                array_unshift($newPermutation, $item);
                yield from generatePermutations($newItems, $newPermutation);
            }
        }
    }
?>
