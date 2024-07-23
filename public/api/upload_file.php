<?php
    include ('cors_bypass.php');
    $uploadDirectory = __DIR__ . '/../images/stores/';

    // Check if the directory exists, and create it if not
    if (!file_exists($uploadDirectory) && !is_dir($uploadDirectory)) {
        mkdir($uploadDirectory, 0755, true);
    }

    // Check if the file input exists in the $_FILES array
    if (isset($_FILES['image']) && isset($_FILES['image']['tmp_name'])) {
        $storeName = isset($_GET['store_name']) ? $_GET['store_name'] : 'default_store';
        $desiredFilename = str_replace(' ', '_', $storeName) . '_' . date('djyGis');
        $fileExtension = '.' . pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
        $destinationFilePath = $uploadDirectory . $desiredFilename . $fileExtension;

        // Move the uploaded file to the destination with the desired filename
        if (move_uploaded_file($_FILES['image']['tmp_name'], $destinationFilePath)) {
            $newImageUrl = '/images/stores/' . $desiredFilename . $fileExtension;
            echo json_encode(['status' => 'success', 'image_url' => $newImageUrl]);
        } else {
            echo json_encode(['status' => 'failed', 'message' => 'Error moving the file']);   
        }
    } else {
        echo json_encode(['status' => 'failed', 'message' => 'File input not found or file not uploaded']);
    }
?>
