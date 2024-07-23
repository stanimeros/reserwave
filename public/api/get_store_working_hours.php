<?php
    require ("connect.php");

    if (isset($_GET["storeSlug"])) {
        $sql = "SELECT * FROM store_working_hours WHERE store_id IN (SELECT id FROM stores WHERE slug = ?);";

        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $_GET["storeSlug"]);
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

