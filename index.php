<?php
session_start();

// Redirect to login if not logged in
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    header('Location: login.php');
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Unblocked Games Hub</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <!-- Logout link -->
  <a href="logout.php" style="position: absolute; top: 10px; right: 10px; color: white;">Logout</a>

  <div class="games-container" id="gamesContainer">
    <!-- Games will be dynamically inserted here by JavaScript -->
  </div>

  <!-- Fullscreen Iframe Modal -->
  <div id="gameModal" class="modal">
    <button id="closeBtn" class="close-btn">X</button>
    <iframe id="gameFrame" src="" frameborder="0"></iframe>
  </div>

  <script src="script.js"></script>
</body>
</html>
