<?php
    require ("connect.php"); 

    $sql = "SELECT * FROM categories";
    if (isset($_GET["categorySlug"])) {
        $sql .= " WHERE slug = ?;";
        
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $_GET["categorySlug"]);
        $stmt->execute();
        
        $result = $stmt->get_result();
        $stmt->close();
    } else {
        $result = $conn->query($sql);
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

