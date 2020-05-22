<?php
ini_set("display_errors", 0);
ini_set("memory_limit", "512M");
ini_set("max_execution_time", "3600");

include_once("script/mypdo.php");
include_once("script/data.php");
include_once("script/querybuilder.php");

try {
    $db_data = parse_ini_file("script/dbc.ini");
    $dcn = "mysql:host={$db_data['host']};charset=utf8mb4";
    $dsn = "mysql:host={$db_data['host']};dbname={$db_data['database']};charset=utf8mb4";
    $db_create = new MyPDO($dcn, $db_data["user"], $db_data["pass"]);
    $sql_db = "CREATE DATABASE IF NOT EXISTS {$db_data['database']} CHARACTER SET utf8mb4;";
    $db_create->exec($sql_db);
    echo "Database created successfully!<br>";
    $db_create = null;
    $db_conn = new MyPDO($dsn, $db_data['user'], $db_data['pass']);
} catch (Exception $e) {
    file_put_contents("script/db.log", date("d.m.Y. H:i")." Error ".$e->getMessage()."\n", FILE_APPEND);
    echo "Could not create database!<br>";
}

try {
    $db_conn = new MyPDO($dsn, $db_data['user'], $db_data['pass']);
    $sql_table = "CREATE TABLE IF NOT EXISTS city (
        ID INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        city_id INT(11) NOT NULL,
        city_name VARCHAR(64) NOT NULL,
        city_country VARCHAR(4) NOT NULL,
        city_lon FLOAT NOT NULL,
        city_lat FLOAT NOT NULL);";
    $db_conn->exec($sql_table);
    echo "Table created successfully!<br>";
    $db_city = new Data($db_conn);
} catch (Exception $e) {
    file_put_contents("script/db.log", date("d.m.Y. H:i")." Error: ".$e->getMessage()."\n", FILE_APPEND);
    echo "Could not create table!<br>";
}

$json_data = json_decode(file_get_contents("script/city.list.json"), true);
$db_content = [];
foreach($json_data as $json_row) {
    array_push($db_content, [$json_row["id"], $json_row["name"], $json_row["country"], $json_row["coord"]["lon"], $json_row["coord"]["lat"]]);
}

if (isset($json_data)) {

    $sql = insertQuery("city", "city_id, city_name, city_country, city_lon, city_lat", "?, ?, ?, ?, ?");

    if ($db_city->bulkWrite($sql, $db_content)) {
        echo "DB write OK<br>";
        $sql_optimize = "OPTIMIZE TABLE city;";
        echo "Optimized ".$db_conn->exec($sql_optimize)." rows.<br>";
    } else {
        echo "DB write NG";
    }
} else {
    echo "JSON file read failed";
}
$db_conn = null;
