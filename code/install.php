<?php
$user_name = $pass = $file_contents = "";
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Installation</title>
    <link rel="stylesheet" href="css/style.css">
</head>

<body>
    <div class="container">
        <h1 class="title">What's the weather?</h1>
        <p class="subtitle">Setup data.</p>

        <form action="<?= htmlspecialchars($_SERVER['PHP_SELF']); ?>" method="post" id="form">
            <div class="flex-col">
                <label for="server" class="invisible"><small>server address</small></label>
                <input type="text" name="server" id="server" placeholder="DB server address">
                <label for="username" class="invisible"><small>database user name</small></label><br>
                <input name="username" id="username" placeholder="DB user name">
                <label for="password" class="invisible"><small>database password</small></label>
                <input type="password" name="password" id="password" placeholder="DB password">
                <label for="api-key" class="inv"><small>Input openweathermap API key</small></label>
                <input type="text" name="api-key" id="api-key" placeholder="Openweathermap API key" size="">
                <input type="submit" value="Submit" class="btn" id="submit">
                <datalist id="cities"></datalist>
            </div>
        </form>

        <div class="response response-ok ow">
            <?php
            if ($_SERVER["REQUEST_METHOD"] == "POST") {
                $host = trim($_POST["server"]);
                $user_name = trim($_POST["username"]);
                $pass = trim($_POST["password"]);
                $api_key = trim($_POST["api-key"]);
                $file_contents = "[Credentials]\nuser = {$user_name}\npass = {$pass}\nhost = {$host}\ndatabase = city_codes\napi-key = {$api_key}";
                file_put_contents("script/dbc.ini", $file_contents);
                echo "Creating new database...<br>";
                include("script/json_to_db.php");
                header("Location: index.php");
                exit;
            }
            ?>
        </div>
    </div>

</body>

</html>
