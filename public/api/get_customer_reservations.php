<?php
    require ("connect.php");

    if (isset($_GET["token"])) {
        $sql = "SELECT GROUP_CONCAT(store_services.title ORDER BY store_reservations.id ASC SEPARATOR ' & ') AS service_title ,SUM(store_services.duration) AS duration, store_reservations.id, MIN(store_reservations.time) AS time, store_reservations.code, DATE_FORMAT(MIN(store_reservations.date), '%d/%m/%y') AS date, stores.title AS store_title,
        CASE 
        WHEN CONCAT(store_reservations.date, ' ', store_reservations.time) >= CONVERT_TZ(NOW(),@@session.time_zone, stores.timezone) THEN '0'
    	    ELSE '1'
        END AS expired , MIN(store_reservations.accepted) AS accepted, store_reservations.accepted_datetime , MIN(store_reservations.cancelled) AS cancelled, store_reservations.cancelled_datetime, 
        stores.slug AS store_slug, stores.service_slug AS service_slug, services.category_slug AS category_slug
        FROM users INNER JOIN store_reservations ON users.id = store_reservations.user_id 
        INNER JOIN store_services ON store_reservations.service_id=store_services.id
        INNER JOIN stores ON store_reservations.store_id = stores.id 
        INNER JOIN services ON services.slug=stores.service_slug
        WHERE users.token=? AND store_reservations.verified = 1
        GROUP BY code 
        ORDER BY store_reservations.date DESC, store_reservations.id ASC;";
        
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $_GET["token"]);
        $stmt->execute();
        
        $result = $stmt->get_result();
        $stmt->close();
    }

    $rows = array();
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()){
            $rows[] = $row;
        }
    }

    print json_encode($rows);
    $conn->close();
?>

