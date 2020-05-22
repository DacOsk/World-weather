<?php

function selectRandomQuery($fields, $table) {
return "SELECT {$fields} FROM {$table} ORDER BY RAND() LIMIT 10";
}

function selectWhereQuery($fields, $table, $conditions) {
    $sql = "SELECT {$fields} FROM {$table} WHERE {$conditions}";
    return $sql;
}

function selectLikeQuery($fields, $table, $field, $sort) {
    $sql = "SELECT {$fields} FROM {$table} WHERE {$field} LIKE ? ORDER BY {$sort} LIMIT 20";
    return $sql;
}

function selectAltQuery($fields, $table, $conditions) {
    $sql = "SELECT {$fields} FROM {$table} {$conditions}";
    return $sql;
}

function insertQuery($table, $fields, $placeholders) {
    $sql = "INSERT INTO {$table} ({$fields}) VALUES ({$placeholders})";
    return $sql;
}

function updateQuery($table, $values) {
    $sql = "UPDATE {$table} SET {$values} WHERE ID = :id";
    return $sql;
}

function deleteQuery($table, $condition) {
    $sql = "DELETE FROM {$table} WHERE ( {$condition} )";
    return $sql;
}
