<?php
session_start();

$correct_password = 'nathan';  // Set your password here

if (isset($_POST['password']) && $_POST['password'] === $correct_password) {
  $_SESSION['logged_in'] = true;
  header('Location: index.html');
  exit();
} else {
  header('Location: login.php?error=true');
  exit();
}
