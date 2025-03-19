<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost');

require_once __DIR__ . '/../lib/Database.php';

try {
    $db = Database::getInstance()->getConnection();
    
    $search = isset($_GET['search']) ? "%{$_GET['search']}%" : '%';
    
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
        WHERE nome LIKE :search OR descrizione LIKE :search
        ORDER BY data_aggiunta DESC
    ");
    
    $stmt->execute([':search' => $search]);
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($products);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>