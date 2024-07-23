<?php
    require ("connect.php");
    require ("functions.php");

    if (isset($_GET["token"])) {
        $user = getUser($_GET["token"], $conn);
        verifyAdmin($user, $conn);
        $slug = 'store_slug_' . $user["id"];

        $sql = "INSERT INTO stores (admin_id, slug) VALUES (?,?);";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("is", $user["id"], $slug);
        $stmt->execute();
        $numRowsAffected = $stmt->affected_rows;
        $stmt->close();
        if ($numRowsAffected>0){
            echo json_encode(['status' => 'success']);
        }else{
            echo json_encode(['status' => 'failed']);
        }
    }
    $conn->close();
?>

