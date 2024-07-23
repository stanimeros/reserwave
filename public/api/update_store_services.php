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

            foreach($data as $service){

                $flag = false;
                $requiredFields = ['id', 'status', 'store_id', 'title', 'description', 'duration', 'price', 'list_price', 'concurrent', 'independent', 'auto_accept', 'controller', 'can_combine_with_ids', 'can_not_combine_with_ids'];
                foreach ($requiredFields as $field) {
                    if (!isset($service[$field])) {
                        // echo json_encode(['error' => 'One or more required fields are missing']);
                        $flag = true;
                        break;
                    }
                }

                if ($flag){
                    break;
                }

                $id = $service['id'];
                $status = $service['status'];
                $store_id = $service['store_id'];
                $title = $service['title'];
                $description = $service['description'];
                $duration = $service['duration'];
                $price = $service['price'];
                $list_price = $service['list_price'];
                $concurrent = $service['concurrent'];
                $independent = $service['independent'];
                $auto_accept = $service['auto_accept'];
                $controller = $service['controller'];
                $can_combine_with_ids = $service['can_combine_with_ids'];
                $can_not_combine_with_ids = $service['can_not_combine_with_ids'];

                if ($id==0){
                    $sql = "INSERT INTO store_services (title, description, duration, concurrent, controller, can_combine_with_ids,
                    can_not_combine_with_ids, independent, status, price, list_price, auto_accept, store_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?);";
            
                    $stmt = $conn->prepare($sql);
                    $stmt->bind_param("ssiisssiissii", $title, $description, $duration, $concurrent, $controller,
                    $can_combine_with_ids, $can_not_combine_with_ids, $independent, $status, $price, $list_price, $auto_accept, $store_id);
                    $stmt->execute();
                    $numRowsAffected += $stmt->affected_rows;
                    $stmt->close();

                }else if (isset($service['unsaved'])){
                    $sql = "UPDATE store_services INNER JOIN stores ON store_services.store_id=stores.id 
                    SET store_services.title = ?, store_services.description = ?, store_services.duration = ?, 
                    store_services.concurrent = ?, store_services.controller = ?, store_services.can_combine_with_ids = ?, 
                    store_services.can_not_combine_with_ids = ?, store_services.independent = ?, store_services.status = ?, 
                    store_services.price = ?, store_services.list_price = ?, store_services.auto_accept = ?, 
                    updated_datetime = CONVERT_TZ(NOW(),@@session.time_zone, stores.timezone)
                    WHERE store_services.id = ? AND stores.admin_id = ?;";
            
                    $stmt = $conn->prepare($sql);
                    $stmt->bind_param("ssiisssiissiii", $title, $description, $duration, $concurrent, $controller,
                    $can_combine_with_ids, $can_not_combine_with_ids, $independent, $status, $price, $list_price, $auto_accept, $id, $user['id']);
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
