<?php
    require ("connect.php");

    if (isset($_GET["lon"], $_GET["lat"], $_GET["serviceSlug"])) {
        $sql = "SELECT * FROM stores WHERE service_slug = ?;";

        $sql = "SELECT * , ST_DISTANCE_SPHERE(POINT(?, ?), POINT(longitude, latitude)) AS distance
        FROM stores 
        WHERE service_slug = ?
        AND status = 1
        HAVING distance <= 50000
        ORDER BY distance;";
        
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("dds", $_GET["lon"], $_GET["lat"], $_GET["serviceSlug"]);
        $stmt->execute();
        
        $result = $stmt->get_result();

        $rows = array();
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()){
                $rows[] = $row;
            }
        }
    
        print json_encode($rows);

        $stmt->close();
    }
    $conn->close();
?>

