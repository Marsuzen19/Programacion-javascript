<?php

// PASO 1: VAMOS A CREAR LAS CABECERAS HTTP
// ESTRICTAS PARA UNA API RESTFUL


//Este codigo permite peticiones desde cualquier origen 
header("Access-Control-Allow-Origin: *");

//Este codigo indica que la respuesta siempre sera en formato JSON y  con el estandar UTF-8 : tildes y caracteres especiales
header("Content-Type: application/json; charset=UTF-8");

//Indico los metodos permitidos para esta API
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");

//header("Access-Control-Allow-Headers: ");


// PASO 2: ESTABLECEMOS CONEXION CON LA BASE DE DATOS

$host = 'sql100.infinityfree.com';
$db = 'if0_41711626_bdmatricula';
$user = 'if0_41711626';
$pass = 'yVIt7l5siia';


// se usa para las conexines

//cuando hay conexion  es como un if
try {
    //PDO es una forma de conectarse a una bd segura y dentro del parentesis se pone el tipo de bd, el host, user y pass
    $pdo = new PDO("mysql:host=$host; dbname=$db; charset=utf8", $user, $pass); //no dejar espacio 
    $pdo -> setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

} catch (\Throwable $th) { // en caso de que haya un error  es como un else

    //Si la conexion falla, la API va a devolver un error 500 (Internal Server Error) un error del servidor
    http_response_code(500);
    echo json_encode (["mensaje" => "Error de conexión a la Base de Datos"]);
    
}

//PASO 3: CAPTURAMOS EL METODO HTTP 
//Solicita que al comienzo se use el protocolo HTTP para que se conecte con la base de datos

$metodoHTTP = $_SERVER['REQUEST_METHOD'];

// PASO 4: CREAMOS LAS PETICIONES CON SWITCH

// (Asegúrate de mantener tus cabeceras y la conexión PDO al inicio del archivo)

switch($metodoHTTP){
    case 'GET':
        // Consultar un alumno por ID o listar todos
        if(isset($_GET['id'])){
            $sql = "SELECT * FROM ALUMNO WHERE ID_ALUMNO = :id";
            $stmt = $pdo->prepare($sql); 
            $stmt->execute(['id' => $_GET['id']]); 
            $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
        } else {
            $sql = "SELECT * FROM ALUMNO";
            $stmt = $pdo->query($sql);
            $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
        echo json_encode($resultado); 
        break;

    case 'POST':
        $datosJSON = json_decode(file_get_contents("php://input"));

        // Validamos que no falten los datos clave
        if (!empty($datosJSON->dni_alumno) && !empty($datosJSON->nombres) && !empty($datosJSON->username)) {
            
            $sql = "INSERT INTO ALUMNO (
                        DNI_ALUMNO, NOMBRES, APELLIDOS, FECHA_NACIMIENTO, 
                        EDAD, GENERO, DIRECCION, CELULAR, CORREO, 
                        NOMBRE_APODERADO, CELULAR_APODERADO, USERNAME, 
                        PASSWORD_HASH, ESTADO
                    )
                    VALUES (
                        :dni, :nombres, :apellidos, :fnac, 
                        :edad, :genero, :dir, :cel, :correo, 
                        :nom_apo, :cel_apo, :user, :pass, :estado
                    )"; 
            
            $stmt = $pdo->prepare($sql);
            
            $exito = $stmt->execute([
                'dni'       => $datosJSON->dni_alumno,
                'nombres'   => $datosJSON->nombres,
                'apellidos' => $datosJSON->apellidos,
                'fnac'      => $datosJSON->fecha_nacimiento,
                'edad'      => $datosJSON->edad,
                'genero'    => $datosJSON->genero,
                'dir'       => $datosJSON->direccion,
                'cel'       => $datosJSON->celular,
                'correo'    => $datosJSON->correo,
                'nom_apo'   => $datosJSON->nombre_apoderado,
                'cel_apo'   => $datosJSON->celular_apoderado,
                'user'      => $datosJSON->username,
                'pass'      => $datosJSON->password_hash,
                'estado'    => $datosJSON->estado ?? 'A' 
            ]);

            if ($exito) {
                http_response_code(201);
                echo json_encode(["mensaje" => "Alumno registrado con éxito."]);
            } else {
                http_response_code(503);
                echo json_encode(["mensaje" => "No se pudo registrar al alumno."]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["mensaje" => "Datos incompletos. Faltan campos requeridos."]);
        }
        break;

    case 'PUT':
        $datosJSON = json_decode(file_get_contents("php://input"));

        // Para actualizar necesitamos el ID obligatoriamente
        if (!empty($datosJSON->id_alumno)) {
            
            $sql = "UPDATE ALUMNO 
                    SET DNI_ALUMNO = :dni, NOMBRES = :nombres, APELLIDOS = :apellidos, 
                        DIRECCION = :dir, CELULAR = :cel, CORREO = :correo, 
                        ESTADO = :estado
                    WHERE ID_ALUMNO = :id";
            
            $stmt = $pdo->prepare($sql);
            
            $exito = $stmt->execute([
                'dni'       => $datosJSON->dni_alumno,
                'nombres'   => $datosJSON->nombres,
                'apellidos' => $datosJSON->apellidos,
                'dir'       => $datosJSON->direccion,
                'cel'       => $datosJSON->celular,
                'correo'    => $datosJSON->correo,
                'estado'    => $datosJSON->estado,
                'id'        => $datosJSON->id_alumno
            ]);

            if ($exito) {
                echo json_encode(["mensaje" => "Registro de alumno actualizado."]);
            } else {
                http_response_code(503);
                echo json_encode(["mensaje" => "Error al intentar actualizar."]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["mensaje" => "Falta el ID_ALUMNO para actualizar."]);
        }
        break;

    case 'DELETE':
        $datosJSON = json_decode(file_get_contents("php://input"));

        if (!empty($datosJSON->id_alumno)) {
            $sql = "DELETE FROM ALUMNO WHERE ID_ALUMNO = :id";
            $stmt = $pdo->prepare($sql);
            $exito = $stmt->execute(['id' => $datosJSON->id_alumno]);

            if ($exito) {
                echo json_encode(["mensaje" => "Alumno eliminado correctamente."]);
            } else {
                http_response_code(503);
                echo json_encode(["mensaje" => "No se pudo eliminar el registro."]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["mensaje" => "Falta el ID_ALUMNO para eliminar."]);
        }
        break;
}


?>