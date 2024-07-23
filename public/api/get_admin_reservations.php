<?php
    require ("connect.php");

    if (isset($_GET["token"],$_GET["date"])) {

        $sql = "SELECT users.first_name,users.last_name,users.phone,users.email,store_reservations.id, MIN(store_reservations.time) AS time, store_reservations.code, DATE_FORMAT(MIN(store_reservations.date), '%d/%m/%y') AS date, GROUP_CONCAT(store_services.title ORDER BY store_reservations.id ASC SEPARATOR ' & ') AS title, SUM(store_services.duration) AS duration,
        CASE 
            WHEN CONCAT(store_reservations.date, ' ', store_reservations.time) >= CONVERT_TZ(NOW(),@@session.time_zone, stores.timezone) THEN '0'
    	    ELSE '1'
        END AS expired , MIN(store_reservations.accepted) AS accepted
        FROM users INNER JOIN store_reservations ON users.id = store_reservations.user_id 
        INNER JOIN store_services ON store_reservations.service_id=store_services.id
        INNER JOIN stores ON store_reservations.store_id = stores.id 
        INNER JOIN users as admins ON admins.id = stores.admin_id
        WHERE admins.id = stores.admin_id AND admins.token = ? AND store_reservations.cancelled = 0 AND store_reservations.verified = 1 
        GROUP BY store_reservations.code HAVING MIN(store_reservations.date)=?
        ORDER BY store_reservations.date ASC, store_reservations.id ASC;";
        
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ss", $_GET["token"],$_GET["date"]);
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

