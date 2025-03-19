<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once __DIR__ . '/../lib/Database.php';

$response = ['success' => false, 'message' => ''];

try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $uploadDir = __DIR__ . '/../assets/img/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

        $fileName = uniqid('prod_') . '.jpg';
        $filePath = $uploadDir . $fileName;

        if (!move_uploaded_file($_FILES['immagine']['tmp_name'], $filePath)) {
            throw new Exception('Errore nel salvataggio dell\'immagine');
        }

        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("
            INSERT INTO prodotti 
            (nome, descrizione, prezzo, quantita, categoria, percorso_immagine)
            VALUES (:nome, :descrizione, :prezzo, :quantita, :categoria, :percorso)
        ");

        $params = [
            ':nome' => htmlspecialchars($_POST['nome']),
            ':descrizione' => htmlspecialchars($_POST['descrizione']),
            ':prezzo' => (float)$_POST['prezzo'],
            ':quantita' => (int)$_POST['quantita'],
            ':categoria' => htmlspecialchars($_POST['categoria']),
            ':percorso' => $fileName
        ];

        if ($stmt->execute($params)) {
            $response['success'] = true;
            $response['message'] = 'Prodotto aggiunto con successo!';
        }
    }
} catch (Exception $e) {
    $response['message'] = $e->getMessage();
    if (isset($filePath) && file_exists($filePath)) {
        unlink($filePath);
    }
}

echo json_encode($response);
?>