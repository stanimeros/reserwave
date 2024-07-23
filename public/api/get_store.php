<?php
    require ("connect.php");

    $sql = "SELECT stores.*, services.category_slug  FROM stores 
        INNER JOIN services ON stores.service_slug = services.slug ";
        
    if (isset($_GET["storeSlug"])) {
        $sql .= 'WHERE stores.slug = ?;';
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $_GET["storeSlug"]);
    }else if (isset($_GET["adminId"])){
        $sql .= 'WHERE stores.admin_id = ?;';
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $_GET["adminId"]);
    }else{
        exit;
    }

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

