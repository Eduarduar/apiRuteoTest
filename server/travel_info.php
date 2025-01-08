<?php

require_once __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

define('API_KEY', $_ENV['TOLLGURU_API_KEY']);

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

if (!isset($data['startLocation']) || !isset($data['destinationLocation']) || !isset($data['deliveryPoints']) || !isset($data['axles']) || !isset($data['tolls'])) {
    echo json_encode([
        "status" => "error",
        "message" => "Faltan los parámetros necesarios: 'origins' y 'destinations'.",
        "error" => "Parámetros faltantes",
        "data" => []
    ]);
    http_response_code(400);
    exit;
}

$from = $data['startLocation'];
$to = $data['destinationLocation'];
$waypoints = $data['deliveryPoints'];
$axles = $data['axles'];
$tolls = $data['tolls'];


$requestData = [
    "from" => [
        "lat" => $from['latitude'],
        "lng" => $from['longitude']
    ],
    "to" => [
        "lat" => $to['latitude'],
        "lng" => $to['longitude']
    ],
    "serviceProvider" => "here",
    "waypoints" => array_map(function ($point) {
        return [
            "lat" => $point['latitude'],
            "lng" => $point['longitude']
        ];
    }, $waypoints),
    "vehicle" => [
        "type" => $axles . "AxlesTruck"
    ],
    "allowTolls" => $tolls
];


$curl = curl_init();

curl_setopt_array($curl, [
    CURLOPT_URL => "https://apis.tollguru.com/toll/v2/origin-destination-waypoints",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "POST",
    CURLOPT_POSTFIELDS => json_encode($requestData),
    CURLOPT_HTTPHEADER => [
        "Content-Type: application/json",
        "x-api-key: " . API_KEY
    ],
]);

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
    echo "cURL Error #:" . $err;
} else {
    echo $response;
}
