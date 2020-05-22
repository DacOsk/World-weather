<?php
include_once('dbconn.php');

$find_city = json_decode(file_get_contents('php://input'), true);

if (isset($find_city)) {
    $find_city_name = selectLikeQuery("*", "city", "city_name", "city_name");
    $city_list = $db_city->getAllRows($find_city_name, $find_city["city"]."%");
    $db_city = null;
    echo json_encode($city_list);
}