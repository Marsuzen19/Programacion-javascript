<?php
header('Content-Type: application/json');

$host = 'localhost';
$db = 'MATRICULA';
$user = 'root';
$pass = '';

try {

$pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Recibir acción
$opcion = $_POST['opcion'] ?? '';

switch ($opcion) {

case '1': // CREAR

$sql = "INSERT INTO CURSO (NOMBRE, DESCRIPCION, HORAS_SEMANA)
        VALUES (?, ?, ?)";

$stmt = $pdo->prepare($sql);

$stmt->execute([
    $_POST['nombre'],
    $_POST['descripcion'],
    $_POST['horas']
]);

echo json_encode([
    "exito" => true,
    "mensaje" => "Curso registrado correctamente."
]);

break;


case '2': // EDITAR

$sql = "UPDATE CURSO 
        SET NOMBRE = ?, 
            DESCRIPCION = ?, 
            HORAS_SEMANA = ?
        WHERE ID_CURSO = ?";

$stmt = $pdo->prepare($sql);

$stmt->execute([
    $_POST['nombre'],
    $_POST['descripcion'],
    $_POST['horas'],
    $_POST['id_curso']
]);

echo json_encode([
    "exito" => true,
    "mensaje" => "Curso actualizado correctamente."
]);

break;


case '3': // ELIMINAR

$sql = "DELETE FROM CURSO WHERE ID_CURSO = ?";

$stmt = $pdo->prepare($sql);
$stmt->execute([$_POST['id_curso']]);

echo json_encode([
    "exito" => true,
    "mensaje" => "Curso eliminado."
]);

break;


case '4': // LISTAR

$sql = "SELECT * FROM CURSO";

$stmt = $pdo->prepare($sql);
$stmt->execute();

$cursos = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($cursos);

break;


default:

echo json_encode([
    "exito" => false,
    "mensaje" => "Opción no válida."
]);

}

} catch (PDOException $e) {

echo json_encode([
    "exito" => false,
    "mensaje" => "Error BD: " . $e->getMessage()
]);

}

?>