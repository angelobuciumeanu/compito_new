<?php
class Database {
    private static $instance;
    private $connection;

    private function __construct() {
        try {
            $this->connection = new PDO(
                'mysql:host=localhost;dbname=marketplace;charset=utf8',
                'root',
                '',
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                ]
            );
        } catch(PDOException $e) {
            die("Database error: " . $e->getMessage());
        }
    }

    public static function getInstance() {
        if(!self::$instance) self::$instance = new self();
        return self::$instance;
    }

    public function getConnection() {
        return $this->connection;
    }
}
?>