<?php

    function verifyToken($token, $conn){
        if (!empty($token)){
            //Continue with parameter token
        }else if (isset($_SESSION['user'])) {
            $token = $_SESSION['user']['token'];
        } elseif (isset($_GET["token"])) {
            $token = $_GET["token"];
        } else {
            exit('No token provided');
        }
        
        $sevenDaysAgo = date('Y-m-d H:i:s', strtotime('-7 days'));
        $sql = "SELECT * FROM users WHERE token = ? AND token_created_at >= ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ss", $token, $sevenDaysAgo);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        
        if ($result !== null) {
            return true;
        } else {
            return false;
        }
    }

    function verifyAdmin($user, $conn){
        if ($user['verified'] == 0){
            echo json_encode(['status' => 'failed', 'message' => 'User is not verified']);
            exit;
        }else if ($user['role'] != 'admin'){
            echo json_encode(['status' => 'failed', 'message' => 'User is not admin']);
            exit;
        }
    }

    function verifyUser($user, $conn){
        if ($user['verified'] == 0){
            echo json_encode(['status' => 'failed', 'message' => 'User is not verified']);
            exit;
        }
    }

    function getUser($token, $conn){
        $userQuery = $conn->prepare("SELECT * FROM users WHERE token = ?;");
        $userQuery->bind_param("s", $token);
        $userQuery->execute();
        $user = $userQuery->get_result()->fetch_assoc();
        $userQuery->close();
        return $user;
    }

    function getFavourites($token, $conn){
        $userQuery = $conn->prepare("SELECT favourites.store_id FROM favourites INNER JOIN users on favourites.user_id = users.id WHERE users.token = ?;");
        $userQuery->bind_param("s", $token);
        $userQuery->execute();
        $result = $userQuery->get_result();
        $userQuery->close();

        $rows = array();
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()){
                $rows[] = $row;
            }
        }
        return $rows;
    }

    function getUserByEmail($email, $conn){
        $userQuery = $conn->prepare("SELECT * FROM users WHERE email = ?;");
        $userQuery->bind_param("s", $email);
        $userQuery->execute();
        $user = $userQuery->get_result()->fetch_assoc();
        $userQuery->close();
        return $user;
    }

    function getUserByEmailOrPhone($email, $phone, $conn){
        $userQuery = $conn->prepare("SELECT * FROM users WHERE email = ? || phone = ?;");
        $userQuery->bind_param("ss", $email, $phone);
        $userQuery->execute();
        $user = $userQuery->get_result()->fetch_assoc();
        $userQuery->close();
        return $user;
    }

    function getUserEmail($user_id, $conn){
        $userQuery = $conn->prepare("SELECT email FROM users WHERE id = ?;");
        $userQuery->bind_param("i", $user_id);
        $userQuery->execute();
        $user = $userQuery->get_result()->fetch_assoc();
        $userQuery->close();
        return $user['email'];
    }

    function getStore($store_id, $conn){
        $storeQuery = $conn->prepare("SELECT * FROM stores WHERE id = ?;");
        $storeQuery->bind_param("i", $store_id);
        $storeQuery->execute();
        $store = $storeQuery->get_result()->fetch_assoc();
        $storeQuery->close();
        return $store;
    }

    function getService($service_id, $store_id, $conn){
        $serviceQuery = $conn->prepare("SELECT * FROM store_services WHERE id = ? AND store_id = ?;");
        $serviceQuery->bind_param("ii", $service_id, $store_id);
        $serviceQuery->execute();
        $service = $serviceQuery->get_result()->fetch_assoc();
        $serviceQuery->close();
        return $service;
    }

    function getToken($user, $conn){
        $sevenDaysAgo = date('Y-m-d H:i:s', strtotime('-7 days'));
        if (!empty($user['token']) && ($user['token_created_at'] >= $sevenDaysAgo)) {
            return $user['token'];
        }else{
            $token = bin2hex(random_bytes(16));
            $query = $conn->prepare("UPDATE users SET token = ?, token_created_at = NOW() WHERE id = ?");
            $query->bind_param("si", $token, $user['id']);
            $query->execute();
            $query->close();

            return $token;
        }
    }

    function refreshToken($user, $conn){
        $token = bin2hex(random_bytes(16));
        $query = $conn->prepare("UPDATE users SET token = ?, token_created_at = NOW() WHERE id = ?");
        $query->bind_param("si", $token, $user['id']);
        $query->execute();
        $query->close();

        return $token;
    }

    function getCountryInfo($country){
        if ($country=='Greece'){
            return array('country_code' => 'gr', 'timezone' => '+02:00');        
        }else{
            echo json_encode(['status' => 'failed', 'message' => 'Unsupported country']);
            exit;
        }
    }
?>