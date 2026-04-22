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


switch($metodoHTTP){
    case 'GET':
        if(isset($_GET['id'])){ //en php todo lo  que tiene dolar es inventado, lo que esta con dolar guion bajo y una palabra en mayuscula no
            $sql = "SELECT * FROM AULA WHERE ID_AULA = :id";
            $stmt = $pdo -> prepare($sql); 
            $stmt -> execute(['id' => $_GET['id']]); 
            $resultado = $stmt -> fetch(PDO::FETCH_ASSOC);
        }
        else{
            //Vamos a obtener todas las tablas
            $sql = "SELECT * FROM AULA ";
            $stmt = $pdo -> query($sql);
            $resultado = $stmt -> fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($resultado); //imprime el resultado

        }
        break; // el break es para que no se ejecute el siguiente case

    case 'POST':
         // Leer el JSON que envía el cliente
        $datosJSON = json_decode(file_get_contents("php://input"));

        // Validar que lleguen los datos requeridos
        if (!empty($datosJSON->nivel) && !empty($datosJSON->grado) && !empty($datosJSON->seccion)) {
            
        //campos tal cual esta en heidi 
                                                                                  
            $sql = "INSERT INTO AULA (NIVEL, GRADO, SECCION, VACANTES_TOTALES, VACANTES_DISPONIBLES)
                    VALUES (:nivel, :grado, :seccion, :totales, :disponibles)"; 
            
            $stmt = $pdo->prepare($sql);
            
            // Ejecutar con los datos del JSON
            $exito = $stmt->execute([
                'nivel' => $datosJSON->nivel,
                'grado' => $datosJSON->grado,
                'seccion' => $datosJSON->seccion,
                'totales' => $datosJSON->vacantes_totales,
                'disponibles' => $datosJSON->vacantes_disponibles
            ]);

            //esto es opcional
            if ($exito) {
                http_response_code(201); // Created
                echo json_encode(["mensaje" => "Aula creada con éxito."]);
            } else {
                http_response_code(503); // Service Unavailable
                echo json_encode(["mensaje" => "No se pudo crear el aula."]);
            }
        } else {
            http_response_code(400); // Bad Request
            echo json_encode(["mensaje" => "Datos incompletos. Faltan campos requeridos."]);
        }
        break;
        
    case 'PUT':
        $datosJSON = json_decode(file_get_contents("php://input"));

        // Para hacer un UPDATE, necesitamos el ID obligatoriamente
        if (!empty($datosJSON->id_aula)) {
            
            $sql = "UPDATE AULA 
                    SET NIVEL = :nivel, GRADO = :grado, SECCION = :seccion, 
                        VACANTES_TOTALES = :totales, VACANTES_DISPONIBLES = :disponibles 
                    WHERE ID_AULA = :id";
            
            $stmt = $pdo->prepare($sql);
            
            $exito = $stmt->execute([
                'nivel' => $datosJSON->nivel,
                'grado' => $datosJSON->grado,
                'seccion' => $datosJSON->seccion,
                'totales' => $datosJSON->vacantes_totales,
                'disponibles' => $datosJSON->vacantes_disponibles,
                'id' => $datosJSON->id_aula
            ]);

            if ($exito) {
                http_response_code(200); // OK
                echo json_encode(["mensaje" => "Aula actualizada correctamente."]);
            } else {
                http_response_code(503);
                echo json_encode(["mensaje" => "No se pudo actualizar el aula."]);
            }
        } else {
            http_response_code(400); // Bad Request
            echo json_encode(["mensaje" => "Falta el ID del aula a actualizar."]);
        }
        break;
    case 'DELETE':
        $datosJSON = json_decode(file_get_contents("php://input"));

        if (!empty($datosJSON->id_aula)) {
            $sql = "DELETE FROM AULA WHERE ID_AULA = :id";
            $stmt = $pdo->prepare($sql);
            $exito = $stmt->execute(['id' => $datosJSON->id_aula]);

            if ($exito) {
                http_response_code(200);
                echo json_encode(["mensaje" => "Aula eliminada correctamente."]);
            } else {
                http_response_code(503);
                echo json_encode(["mensaje" => "No se pudo eliminar el registro."]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["mensaje" => "Falta el ID del aula a eliminar."]);
        }
        break;
}

?>