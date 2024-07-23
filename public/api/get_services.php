<?php
    require ("connect.php");

    $sql = "SELECT * FROM services";
    if (isset($_GET["categorySlug"])){
        $sql .= " WHERE category_slug = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $_GET["categorySlug"]);
    }else if (isset($_GET["serviceSlug"])){
        $sql .= " AND slug = ?;";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ss", $_GET["categorySlug"],$_GET["serviceSlug"]);
    }else{
        $stmt = $conn->prepare($sql);
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

