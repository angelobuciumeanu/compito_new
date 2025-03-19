<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost');
header('Access-Control-Allow-Methods: GET');

require_once __DIR__ . '/../lib/Database.php';

try {
    $db = Database::getInstance()->getConnection();
    
    $stmt = $db->prepare("
        SELECT 
            id,
            nome,
            descrizione,
            prezzo,
            quantita,
            categoria,
            percorso_immagine,
            DATE_FORMAT(data_aggiunta, '%d/%m/%Y %H:%i') as data_aggiunta
        FROM prodotti
        ORDER BY data_aggiunta DESC
    ");
    
    $stmt->execute();
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'data' => $products
    ]);
    
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database Error: ' . $e->getMessage()
    ]);
}
?>