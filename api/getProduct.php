<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost');
require_once __DIR__ . '/../lib/Database.php';

try {
    $db = Database::getInstance()->getConnection();
    $stmt = $db->query("
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
    
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    
} catch (PDOException $e) {
    echo json_encode(['error' => 'Errore nel recupero dei prodotti']);
}
?>