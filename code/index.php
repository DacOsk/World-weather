<?php
if (file_get_contents("script/dbc.ini") == "") {
    header("Location: install.php");
    exit;
} else {
    if (file_exists("install.php")) {
        unlink(realpath("install.php"));
        unlink(realpath("script/json_to_db.php"));
        unlink(realpath("script/city.list.json"));
    }
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Weather</title>
    <link rel="stylesheet" href="css/style.css">
</head>

<body>
    <div class="container">
        <h1 class="title">What's the weather?</h1>
        <p class="subtitle">Enter the name of a city.</p>

        <form method="post" id="form">
            <div class="flex-col">
                <label for="city" class="invisible"><small>Input city name</small></label><br>
                <input autocomplete="off" list="cities" name="city" id="city" placeholder="City name">
                <span id="city-code" class="invisible"></span>
                <input type="submit" value="Submit" class="btn" id="submit">
                <datalist id="cities"></datalist>
            </div>
        </form>

        <div class="response"></div>

    </div>

    <script src="js/main.js"></script>
</body>

</html>