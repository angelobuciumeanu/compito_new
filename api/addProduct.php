<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
require_once __DIR__ . '/../lib/Database.php';

$response = ['success' => false, 'message' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Validazione campi
        $requiredFields = ['nome', 'descrizione', 'prezzo', 'quantita', 'categoria'];
        foreach ($requiredFields as $field) {
            if (empty($_POST[$field])) {
                throw new Exception("Il campo $field è obbligatorio");
            }
        }

        // Validazione immagine
        if (!isset($_FILES['immagine']) || $_FILES['immagine']['error'] !== UPLOAD_ERR_OK) {
            throw new Exception('Errore nel caricamento dell\'immagine');
        }

        $file = $_FILES['immagine'];
        $allowedTypes = ['image/jpeg'];
        if (!in_array($file['type'], $allowedTypes)) {
            throw new Exception('Sono accettati solo file JPG');
        }

        // Crea directory se non esiste
        $uploadDir = __DIR__ . '/../assets/img/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        // Genera nome univoco
        $fileName = uniqid('prod_') . '.jpg';
        $targetPath = $uploadDir . $fileName;

        // Sposta il file
        if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
            throw new Exception('Errore nel salvataggio del file');
        }

        // Inserisci nel database
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
            ':percorso' => '/assets/img/' . $fileName
        ];

        if ($stmt->execute($params)) {
            $response['success'] = true;
            $response['message'] = 'Prodotto aggiunto con successo';
        }

    } catch (Exception $e) {
        $response['message'] = $e->getMessage();
        if (isset($targetPath) && file_exists($targetPath)) {
            unlink($targetPath);
        }
    }
}

echo json_encode($response);
?>