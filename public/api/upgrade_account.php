<?php
    require ("connect.php");
    require ("functions.php");

    if (isset($_GET["token"])) {
        $user = getUser($_GET["token"], $conn);
        verifyUser($user, $conn);

        $sql = "UPDATE users SET role = 'admin' WHERE token = ?;";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $_GET["token"]);
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

