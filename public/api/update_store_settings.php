<?php
    require ("connect.php");
    require ("functions.php");

    if ($_SERVER['REQUEST_METHOD'] === 'UPDATE') {
        $json_data = file_get_contents('php://input');
        $data = json_decode($json_data, true);
        
        if ($data !== null) {

            $requiredFields = ['token', 'storeId', 'title', 'slug', 'service_slug', 'description', 'phone', 'street', 'city', 'country', 'zip', 'concurrent', 'image_url'];
            foreach ($requiredFields as $field) {
                if (!isset($data[$field])) {
                    echo json_encode(['error' => 'One or more required fields are missing']);
                    exit();
                }
            }

            $token = $data['token'];
            $storeId = $data['storeId'];
            $title = $data['title'];
            $slug = $data['slug'];
            $service_slug = $data['service_slug'];
            $description = $data['description'];
            $phone = $data['phone'];
            $street = $data['street'];
            $city = $data['city'];
            $country = $data['country'];
            $zip = $data['zip'];
            $concurrent = $data['concurrent'];
            $image_url = $data['image_url'];

            $countryInfo = getCountryInfo($country);

            $store = getStore($storeId, $conn);
            $user = getUser($token, $conn);
            verifyAdmin($user, $conn);

            $sql = "UPDATE stores SET title = ?, slug = ?, service_slug = ?, description = ?, phone = ?, street = ?, city = ?, country = ?, country_code = ?, timezone = ?, zip = ?, concurrent = ?, image_url = ?
                WHERE id = ? AND admin_id = ?;";
        
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("sssssssssssisii", $title, $slug, $service_slug, $description, $phone, $street, $city, $country, $countryInfo['country_code'], $countryInfo['timezone'], $zip, $concurrent, $image_url, $storeId, $user['id']);
            $stmt->execute();
            $numRowsAffected = $stmt->affected_rows;
            $stmt->close();

            if ($numRowsAffected>0){
                echo json_encode(['status' => 'success']);
            }else{
                echo json_encode(['status' => 'failed']);
            }
        } else {
            echo json_encode(['status' => 'failed', 'message' => 'Invalid JSON data']);            
        }
    } else {
        echo json_encode(['status' => 'failed', 'message' => 'Method not allowed']);
    }
    $conn->close();
?>
