<?php
    require ("connect.php");

    if (isset($_GET["storeId"],$_GET["date"])) {
        $sql = "SELECT time,store_reservations.id,store_services.id as service_id, store_services.duration,store_services.concurrent, 
        CONVERT_TZ(CURTIME(),@@session.time_zone, stores.timezone) AS request_time
        FROM store_reservations 
        INNER JOIN store_services ON store_services.id = store_reservations.service_id 
        INNER JOIN stores ON store_reservations.store_id = stores.id 
        WHERE date = ? AND store_reservations.store_id = ? AND store_reservations.cancelled = 0;"; 
        
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("si", $_GET["date"], $_GET["storeId"]);
        $stmt->execute();
        
        $result = $stmt->get_result();

        $sql = "SELECT CONVERT_TZ(NOW(),@@session.time_zone, stores.timezone) AS request_timestamp FROM stores WHERE id = ?;";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $_GET["storeId"]);
        $stmt->execute();
        $timestamp = $stmt->get_result()->fetch_assoc();

        $stmt->close();
    }

    $rows = array();
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()){
            $rows[] = $row;
        }
    }

    $response = array(
        'timestamp' => $timestamp["request_timestamp"],
        'rows' => $rows
    );
    echo json_encode($response);
    
    $conn->close();
?>

