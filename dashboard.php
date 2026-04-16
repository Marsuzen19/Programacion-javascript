<?php
// Evita que el navegador guarde copia de la página 
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");

session_start(); 

// Si NO existe la sesión, rebota al login
if (!isset($_SESSION['usuario_id'])) {
    header("Location: login.html");
    exit();
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Sesión Iniciada - Estudiante</title>
</head>
<body>
    <h1>Bienvenido al Sistema</h1>
    <p>Solo tú puedes ver esto porque estás logueado.</p>
    
    <a href="php/logout.php" class="btn btn-danger">Cerrar Sesión</a>
</body>
</html>