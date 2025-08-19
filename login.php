<?php
session_start();
if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true) {
  header('Location: index.html');
  exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login - Unblocked Games Hub</title>
</head>
<body>

  <h2>Login to Access Games Hub</h2>

  <form action="authenticate.php" method="POST">
    <input type="password" name="password" placeholder="Enter password" required>
    <button type="submit">Login</button>
  </form>

</body>
</html>
