<?php
ini_set("display_errors", 1);
include_once("dbconn.php");
$api_key = $db_data["api-key"]; 
$city = [];

$response = json_encode([
    "name" => "Error",
    "current" => ["country" => "NG"], "weather" => [["description" => "Could not get data", "icon" => "50d"]], "current" => ["temp" => "X"]
], JSON_HEX_TAG);
try {
    $city = json_decode(file_get_contents('php://input'), true);
    $city_name = $city["name"];
    $city_id = intval($city["id"]);

    if ($city_id == 0) {
        $find_city_pos = selectWhereQuery("*", "city", "city_name = ?");
        $find = $city_name;
    } else {
        $find_city_pos = selectWhereQuery("*", "city", "city_id = ?");
        $find = $city_id;
    }

    $city_data = $db_city->getSingleRow($find_city_pos, $find);
        if ($city_data) {
            $city_lat = $city_data["city_lat"];
            $city_lon = $city_data["city_lon"];
        }

    $weatherApiUrl = "http://api.openweathermap.org/data/2.5/onecall?&lat={$city_lat}&lon={$city_lon}&units=metric&exclude=minutely,hourly&appid={$api_key}";

    $ch = curl_init();

    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_URL, $weatherApiUrl);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
    curl_setopt($ch, CURLOPT_VERBOSE, 0);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

    $response = curl_exec($ch);

    curl_close($ch);
} catch (Exception $e) {
    file_put_contents("db.log", date("d.m.Y. H:i") . " Error " . $e->getMessage(), FILE_APPEND);
}

$db_conn = null;
echo $response;
