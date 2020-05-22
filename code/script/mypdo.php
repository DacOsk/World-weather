<?php
//ini_set("max_execution_time", "3600");
/*
Create database connection
*/
class MyPDO extends PDO {

    public function __construct($dsn, $username = NULL, $password = NULL, $options = []) {
        $default_options = [
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        ];
        $options = array_replace($default_options, $options);
        parent::__construct($dsn, $username, $password, $options);
    }

    public function getOne($sql) {
            return $this->query($sql);
    }

    public function run($sql, $args) {
        $stmt = $this->prepare($sql);
        $stmt->execute($args);
        return $stmt;
    }

    public function write($sql, $args) {
        $this->prepare($sql)->execute($args);
    }
}