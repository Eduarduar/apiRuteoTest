<?php
// Cargar variables de entorno para manejar la clave API
require_once __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

define('API_KEY', $_ENV['API_KEY']); // Asegúrate de configurar tu clave en el archivo .env

// Configuración de encabezados para solicitudes CORS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Verificar que la solicitud sea POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        "status" => "error",
        "message" => "Método no permitido. Utiliza POST.",
    ]);
    http_response_code(405);
    exit;
}

// Obtener los datos enviados desde el cliente
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['type']) || !isset($data['query'])) {
    echo json_encode([
        "status" => "error",
        "message" => "Faltan parámetros necesarios.",
    ]);
    http_response_code(400);
    exit;
}

$type = $data['type'];
$query = $data['query'];

// Construir la URL de la API según el tipo de solicitud
$url = "";
if ($type === "autocomplete") {
    $url = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" . urlencode($query) . "&key=" . API_KEY;
} elseif ($type === "details") {
    $url = "https://maps.googleapis.com/maps/api/place/details/json?place_id=" . urlencode($query) . "&key=" . API_KEY;
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Tipo de solicitud no válido.",
    ]);
    http_response_code(400);
    exit;
}

// Realizar la solicitud a la API de Google
try {
    $response = file_get_contents($url);
    if ($response === FALSE) {
        throw new Exception("Error al conectar con la API de Google.");
    }

    echo $response; // Devolver la respuesta directamente al cliente
    http_response_code(200);
} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage(),
    ]);
    http_response_code(500);
}
