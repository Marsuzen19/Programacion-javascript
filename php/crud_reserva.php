<?php
header('Content-Type: application/json');

$host = 'localhost';
$db = 'MATRICULA';
$user = 'root';
$pass = '';

try {

$pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user,$pass);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Recibir qué acción queremos hacer
$opcion = $_POST['opcion'] ?? '';

switch ($opcion) {

case '1': // CREAR REGISTRO

$sql = "INSERT INTO RESERVA 
(ID_ALUMNO, ID_AULA, CODIGO_PAGO, ESTADO_PAGO) 
VALUES (?, ?, ?, ?)";

$stmt = $pdo->prepare($sql);

$stmt->execute([
$_POST['id_alumno'],
$_POST['id_aula'],
$_POST['codigo_pago'],
$_POST['estado_pago']
]);

echo json_encode([
"exito" => true,
"mensaje" => "Reserva registrada correctamente."
]);

break;


case '2': // EDITAR REGISTRO

$sql = "UPDATE RESERVA SET 
ID_ALUMNO=?,
ID_AULA=?,
CODIGO_PAGO=?,
ESTADO_PAGO=?
WHERE ID_RESERVA=?";

$params = [
$_POST['id_alumno'],
$_POST['id_aula'],
$_POST['codigo_pago'],
$_POST['estado_pago'],
$_POST['id_reserva']
];

$stmt = $pdo->prepare($sql);
$stmt->execute($params);

echo json_encode([
"exito" => true,
"mensaje" => "Reserva actualizada correctamente."
]);

break;


case '3': // ELIMINAR REGISTRO

$sql = "DELETE FROM RESERVA WHERE ID_RESERVA = ?";
$stmt = $pdo->prepare($sql);

$stmt->execute([$_POST['id_reserva']]);

echo json_encode([
"exito" => true,
"mensaje" => "Reserva eliminada."
]);

break;


case '4': // LISTAR

$sql = "SELECT * FROM RESERVA";
$stmt = $pdo->prepare($sql);
$stmt->execute();

$reservas = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($reservas);

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