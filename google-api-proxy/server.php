<?php
require_once __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

define('API_KEY', $_ENV['API_KEY']);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  echo json_encode([
    "status" => "error",
    "message" => "Método no permitido. Utiliza POST.",
    "error" => "Método incorrecto",
    "data" => []
  ]);
  http_response_code(405);
  exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['origins']) || !isset($data['destinations'])) {
  echo json_encode([
    "status" => "error",
    "message" => "Faltan los parámetros necesarios: 'origins' y 'destinations'.",
    "error" => "Parámetros faltantes",
    "data" => []
  ]);
  http_response_code(400);
  exit;
}

$origins = $data['origins'];
$destinations = $data['destinations'];

$url = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=" . urlencode($origins) . "&destinations=" . urlencode($destinations) . "&key=" . API_KEY;

try {
  $response = file_get_contents($url);
  if ($response === FALSE) {
    throw new Exception("No se pudo conectar a la API de Google.");
  }

  $data = json_decode($response, true);

  echo json_encode([
    "status" => "ok",
    "message" => "Datos obtenidos correctamente.",
    "error" => null,
    "data" => $data
  ]);
  http_response_code(200);
} catch (Exception $e) {
  // Manejo de errores
  echo json_encode([
    "status" => "error",
    "message" => "Ocurrió un error al obtener datos de la API.",
    "error" => $e->getMessage(),
    "data" => []
  ]);
  http_response_code(500);
}
