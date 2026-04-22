<?php
// Indicar que la respuesta será en formato JSON
header('Content-Type: application/json');

// Credenciales de la Base de Datos
$host = 'sql100.infinityfree.com';
$db = 'if0_41711626_bdmatricula';
$user = 'if0_41711626';
$pass = 'yVIt7l5siia';
// Cambiar si tu MySQL tiene contraseña

try {
    // Conexión segura usando PDO
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Recibir los datos del POST (enviados por AJAX)
    $usuarioIngresado = $_POST['user'] ?? '';
    $passwordIngresada = $_POST['pass'] ?? '';

    // Preparar la consulta SQL para buscar al usuario
    $sql = "SELECT id, password_hash FROM usuario WHERE username = :usuario LIMIT 1"; // el nombre de la tabla debe estar escrito en phpmyadmin en este caso usuario debe estar en mayusucula
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':usuario', $usuarioIngresado);
    $stmt->execute();

    $usuarioFila = $stmt->fetch(PDO::FETCH_ASSOC);

    // Validar si el usuario existe y si la contraseña coincide con el hash
    if ($usuarioFila && password_verify($passwordIngresada, $usuarioFila['password_hash'])) {
        
        // Iniciar sesión en PHP (opcional pero recomendado para mantener el estado)
        session_start();
        $_SESSION['usuario_id'] = $usuarioFila['id'];

        echo json_encode([
            "exito" => true,
            "mensaje" => "Login correcto"
        ], JSON_UNESCAPED_UNICODE); //transfroma letras ñ y tildaciones// // //

    } else {
        // Credenciales incorrectas
        echo json_encode([
            "exito" => false,
            "mensaje" => "Usuario o contraseña incorrectos."
        ], JSON_UNESCAPED_UNICODE);
    }

} catch (PDOException $e) {
    // Manejo de errores de base de datos
    echo json_encode([
        "exito" => false,
        "mensaje" => "Error de conexión a la BD."
    ], JSON_UNESCAPED_UNICODE);
}
?>