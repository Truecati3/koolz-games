<?php
session_start();

// Define the correct password
$correct_password = 'your_secret_password';  // Change this to your actual password

// Check if the submitted password matches
if (isset($_POST['password']) && $_POST['password'] === $correct_password) {
    $_SESSION['logged_in'] = true;
    header('Location: index.php');  // Redirect to the games hub
    exit();
} else {
    header('Location: login.php?error=true');  // Incorrect password, redirect back to login
    exit();
}
