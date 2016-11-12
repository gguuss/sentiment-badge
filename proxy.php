<?php
    $query = $_GET["query"];
    $uri = "https://www.google.com/search?q=" . urlencode($query);
    $htm = file_get_contents($uri);
    $htm = "<html><base href=\"https://google.com\">" . $htm;
    echo $htm;
?>
