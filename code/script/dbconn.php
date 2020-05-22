<?php
ini_set("max_execution_time", "3600");

include_once("mypdo.php");
include_once("data.php");
include_once("querybuilder.php");

try {
$db_data = parse_ini_file("dbc.ini");
$dsn = "mysql:host={$db_data['host']};dbname={$db_data['database']};charset=utf8mb4";
$db_conn = new MyPDO($dsn, $db_data['user'], $db_data['pass']);
$db_city = new Data($db_conn);
} catch (Exception $e) {
    file_put_contents("db.log", "Error ".$e->getMessage(), FILE_APPEND);
}