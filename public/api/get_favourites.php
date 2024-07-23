<?php
    require ("connect.php");
    require ("functions.php");

    if (verifyToken($_GET['token'], $conn)){
        $user = getUser($_GET['token'], $conn);

        $sql = "SELECT favourites.*, stores.* , services.category_slug
            FROM favourites 
            INNER JOIN stores ON stores.id = favourites.store_id 
            INNER JOIN services ON stores.service_slug = services.slug
            WHERE user_id = ?;";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $user["id"]);
        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();

        $rows = array();
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()){
                $rows[] = $row;
            }
        }

        echo json_encode(['status' => 'success', 'data' => $rows]);
    }else{
        echo json_encode(['status' => 'failed']);
    }
    $conn->close();
?>

