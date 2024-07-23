<?php
    require ("connect.php");

    if (isset($_GET["storeId"])) {
        $sql = "SELECT * FROM `reviews` INNER JOIN users ON reviews.user_id = users.id WHERE reviews.store_id=?";
        
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $_GET["storeId"]);
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

