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

$origins = explode(',', $data['origins']);
$destinations = explode(',', $data['destinations']);

$requestData = [
  "origins" => [
    [
      "waypoint" => [
        "location" => [
          "latLng" => [
            "latitude" => (float)$origins[0],
            "longitude" => (float)$origins[1]
          ]
        ]
      ],
      "routeModifiers" => [
        "vehicleInfo" => [
          "emissionType" => "DIESEL"
        ]
      ]
    ]
  ],
  "destinations" => [
    [
      "waypoint" => [
        "location" => [
          "latLng" => [
            "latitude" => (float)$destinations[0],
            "longitude" => (float)$destinations[1]
          ]
        ]
      ]
    ]
  ],
  "travelMode" => "DRIVE",
  "extraComputations" => ["TOLLS"]
];

$url = 'https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix';

$headers = [
  'Content-Type: application/json',
  'X-Goog-Api-Key: ' . API_KEY,
  'X-Goog-FieldMask: originIndex,destinationIndex,travel_advisory.tollInfo,duration,distanceMeters,status'
];

$options = [
  'http' => [
    'method'  => 'POST',
    'header'  => implode("\r\n", $headers),
    'content' => json_encode($requestData),
    'timeout' => 60
  ]
];

$context = stream_context_create($options);

try {
  $response = file_get_contents($url, false, $context);
  if ($response === FALSE) {
    throw new Exception("No se pudo conectar a la API de Google.");
  }

  $decodedResponse = json_decode($response, true);

  echo json_encode([
    "status" => "ok",
    "message" => "Datos obtenidos correctamente.",
    "error" => null,
    "data" => $decodedResponse
  ]);
  http_response_code(200);
} catch (Exception $e) {
  echo json_encode([
    "status" => "error",
    "message" => "Ocurrió un error al obtener datos de la API.",
    "error" => $e->getMessage(),
    "data" => []
  ]);
  http_response_code(500);
}
