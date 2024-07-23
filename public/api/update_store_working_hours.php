<?php
    require ("connect.php");
    require ("functions.php");

    if ($_SERVER['REQUEST_METHOD'] === 'UPDATE' && isset($_GET['token'])) {
        $json_data = file_get_contents('php://input');
        $data = json_decode($json_data, true);

        $user = getUser($_GET['token'], $conn);
        verifyAdmin($user, $conn);
        $numRowsAffected = 0;
        
        if ($data !== null) {

            foreach($data as $workingHour){

                $requiredFields = ['id', 'status', 'store_id', 'day', 'start_time', 'end_time'];
                foreach ($requiredFields as $field) {
                    if (!isset($workingHour[$field])) {
                        // echo json_encode(['error' => 'One or more required fields are missing']);
                        exit();
                    }
                }

                $id = $workingHour['id'];
                $status = $workingHour['status'];
                $store_id = $workingHour['store_id'];
                $day = $workingHour['day'];
                $start_time = $workingHour['start_time'];
                $end_time = $workingHour['end_time'];

                if ($id==0){
                    $sql = "INSERT INTO store_working_hours (store_id, day, start_time, end_time, status) VALUES (?, ?, ?, ?, ?);";
            
                    $stmt = $conn->prepare($sql);
                    $stmt->bind_param("iissi", $store_id, $day, $start_time, $end_time, $status);
                    $stmt->execute();
                    $numRowsAffected += $stmt->affected_rows;
                    $stmt->close();

                }else if (isset($workingHour['unsaved'])){
                    $sql = "UPDATE store_working_hours INNER JOIN stores ON store_working_hours.store_id=stores.id 
                    SET day = ?, start_time = ?, end_time = ?, store_working_hours.status = ?, updated_datetime = CONVERT_TZ(NOW(),@@session.time_zone, stores.timezone)
                    WHERE store_working_hours.id = ? AND stores.admin_id = ?;";
            
                    $stmt = $conn->prepare($sql);
                    $stmt->bind_param("issiii", $day, $start_time, $end_time, $status, $id, $user['id']);
                    $stmt->execute();
                    $numRowsAffected += $stmt->affected_rows;
                    $stmt->close();

                }
            }

            if ($numRowsAffected>0){
                echo json_encode(['status' => 'success']);
            }else{
                echo json_encode(['status' => 'failed']);
            }
        } else {
            echo json_encode(['status' => 'failed', 'message' => 'Invalid JSON data']);
        }
    } else {
        echo json_encode(['status' => 'failed', 'message' => 'Method not allowed']);
    }
    $conn->close();
?>
