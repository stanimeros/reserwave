<?php
    require ("connect.php");

    if (isset($_GET["email"], $_GET["token"])) {
        $sql = "SELECT token 
        FROM users 
        WHERE email = ?;";

        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $_GET["email"]);
        $stmt->execute();
        
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        
        if ($row && $row['token'] == $_GET["token"]) {
            $sql = "UPDATE users 
                SET verified = 1 
                WHERE email = ?;";
    
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("s", $_GET["email"]);
            $stmt->execute();
        }

        $stmt->close();
    } 
    $conn->close();

    header("Location: https://www.reserwave.com/");
    exit;
?>

