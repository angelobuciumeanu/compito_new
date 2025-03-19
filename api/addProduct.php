<?php
header('Content-Type: application/json');
require_once __DIR__.'/../lib/Database.php';

$response = ['success' => false];

try {
    if($_SERVER['REQUEST_METHOD'] === 'POST') {
        $uploadDir = __DIR__.'/../assets/img/';
        if(!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);
        
        $fileName = uniqid().'.jpg';
        move_uploaded_file($_FILES['immagine']['tmp_name'], $uploadDir.$fileName);

        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("INSERT INTO prodotti (nome, descrizione, prezzo, quantita, categoria, percorso_immagine) 
                            VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $_POST['nome'],
            $_POST['descrizione'],
            $_POST['prezzo'],
            $_POST['quantita'],
            $_POST['categoria'],
            $fileName
        ]);
        
        $response['success'] = true;
    }
} catch(Exception $e) {
    $response['error'] = $e->getMessage();
}

echo json_encode($response);
?>