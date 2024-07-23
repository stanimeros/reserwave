<?php
    require ("connect.php");
    require ("functions.php");

    if (isset($_GET['store_id'], $_GET['token'])) {
        if (verifyToken($_GET['token'], $conn)){
            $user = getUser($_GET['token'], $conn);

            $sql = "DELETE FROM favourites WHERE store_id = ? AND user_id = ?;";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ii", $_GET['store_id'], $user['id']);
            $stmt->execute();
            $stmt->close();

            echo json_encode(['status' => 'success']);
        }else{
            echo json_encode(['status' => 'failed']);
        }
    } else {
        echo json_encode(['status' => 'failed']);
    }
    $conn->close();
?>
