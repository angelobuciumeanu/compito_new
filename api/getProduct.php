<?php
header('Content-Type: application/json');
require_once __DIR__.'/../lib/Database.php';

try {
    $db = Database::getInstance()->getConnection();
    $stmt = $db->query("SELECT * FROM prodotti ORDER BY data_aggiunta DESC");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} catch(Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>