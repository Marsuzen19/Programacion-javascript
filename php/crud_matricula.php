<?php
header('Content-Type: application/json');

$host = 'localhost';
$db = 'MATRICULA';
$user = 'root';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $opcion = $_POST['matri_opcion'] ?? '';

    switch ($opcion) {

        case '1': // CREAR MATRÍCULA
            // 1. Buscar ID del alumno (usamos trim para limpiar espacios)
            $stmtAlu = $pdo->prepare("SELECT ID_ALUMNO FROM ALUMNO WHERE CONCAT(NOMBRES, ' ', APELLIDOS) LIKE ? LIMIT 1");
            $stmtAlu->execute(["%" . trim($_POST['matri_alumno']) . "%"]);
            $alumno = $stmtAlu->fetch();

            // 2. Buscar ID del curso
            $stmtCur = $pdo->prepare("SELECT ID_CURSO FROM CURSO WHERE NOMBRE LIKE ? LIMIT 1");
            $stmtCur->execute(["%" . trim($_POST['matri_curso']) . "%"]);
            $curso = $stmtCur->fetch();

            if ($alumno && $curso) {
                $sql = "INSERT INTO MATRICULA_ALUMNO (ID_ALUMNO, ID_CURSO, FECHA_INSCRIPCION, ESTADO_MATRICULA) 
                        VALUES (?, ?, ?, ?)";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([
                    $alumno['ID_ALUMNO'], 
                    $curso['ID_CURSO'],
                    $_POST['matri_fecha'],
                    $_POST['matri_estado']
                ]);

                echo json_encode(["exito" => true, "mensaje" => "Matrícula registrada correctamente."]);
            } else {
                echo json_encode(["exito" => false, "mensaje" => "El alumno o el curso no existen en la base de datos."]);
            }
            break;

        case '2': // EDITAR MATRÍCULA
            $stmtAlu = $pdo->prepare("SELECT ID_ALUMNO FROM ALUMNO WHERE CONCAT(NOMBRES, ' ', APELLIDOS) LIKE ? LIMIT 1");
            $stmtAlu->execute(["%" . trim($_POST['matri_alumno']) . "%"]);
            $alumno = $stmtAlu->fetch();

            $stmtCur = $pdo->prepare("SELECT ID_CURSO FROM CURSO WHERE NOMBRE LIKE ? LIMIT 1");
            $stmtCur->execute(["%" . trim($_POST['matri_curso']) . "%"]);
            $curso = $stmtCur->fetch();

            if ($alumno && $curso) {
                $sql = "UPDATE MATRICULA_ALUMNO SET ID_ALUMNO = ?, ID_CURSO = ?, FECHA_INSCRIPCION = ?, ESTADO_MATRICULA = ? 
                        WHERE ID_MATRICULA = ?";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([
                    $alumno['ID_ALUMNO'],
                    $curso['ID_CURSO'],
                    $_POST['matri_fecha'],
                    $_POST['matri_estado'],
                    $_POST['matri_id']
                ]);
                echo json_encode(["exito" => true, "mensaje" => "Matrícula actualizada correctamente."]);
            } else {
                echo json_encode(["exito" => false, "mensaje" => "No se pudo actualizar: El alumno o curso no existen."]);
            }
            break;

        case '3': // ELIMINAR MATRÍCULA
            // Corregido: Nombre de tabla consistente con el resto del CRUD
            $sql = "DELETE FROM MATRICULA_ALUMNO WHERE ID_MATRICULA = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$_POST['matri_id']]);

            echo json_encode([
                "exito" => true,
                "mensaje" => "Matrícula eliminada del sistema."
            ]);
            break;

        case '4': // LISTAR MATRÍCULAS
            $sql = "SELECT 
                        m.ID_MATRICULA, 
                        CONCAT(a.NOMBRES, ' ', a.APELLIDOS) AS NOMBRE_COMPLETO_ALUMNO, 
                        c.NOMBRE AS NOMBRE_DEL_CURSO, 
                        m.FECHA_INSCRIPCION,
                        m.ESTADO_MATRICULA
                    FROM MATRICULA_ALUMNO m
                    INNER JOIN ALUMNO a ON m.ID_ALUMNO = a.ID_ALUMNO
                    INNER JOIN CURSO c ON m.ID_CURSO = c.ID_CURSO";

            $stmt = $pdo->prepare($sql);
            $stmt->execute();
            $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode($resultado);
            break;

        default:
            echo json_encode(["exito" => false, "mensaje" => "Acción no permitida."]);
    }

} catch (PDOException $e) {
    echo json_encode([
        "exito" => false,
        "mensaje" => "Error en la base de datos: " . $e->getMessage()
    ]);
}
?>