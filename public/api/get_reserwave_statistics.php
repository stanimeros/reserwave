<?php
    require ("connect.php");

    $sql = "SELECT
    (SELECT COUNT(*) FROM users) AS users_count,
    (SELECT COUNT(*) FROM store_services) AS store_services_count,
    (SELECT COUNT(*) FROM store_reservations) AS store_reservations_count,
    (SELECT COUNT(*) FROM stores) AS stores_count,
    (SELECT COUNT(*) FROM services) AS services_count,
    (SELECT COUNT(*) FROM categories) AS categories_count;";

    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();

    $rows = array();
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()){
            $rows[] = $row;
        }
    }

    print json_encode($rows);
    $conn->close();
?>

