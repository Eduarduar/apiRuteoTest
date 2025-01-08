<!DOCTYPE html>
<html lang="en" class="scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Planificador de ruta</title>
  <style>
    html,
    body {
      height: 100%;
      margin: 0;
      padding: 0;
    }
  </style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
  <link rel="stylesheet" href="assets/css/tailwind.css" />
</head>

<body class="bg-gray-100 min-h-screen h-full scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200 scrollbar-thumb-rounded-full scrollbar-track-rounded-full flex flex-col items-center justify-center">

  <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#Modal-ApiRuteo">
    Calcular ruta
  </button>

  <div id="container-modals">
    <div class="modal fade" id="Modal-ApiRuteo" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5 text-3xl font-bold text-blue-600">
              Calculadora de Ruta
            </h1>
          </div>
          <div class="modal-body !p-1">
            <?php include './components/apiRuteo.php'; ?>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div id="container-modals-apirute"></div>


</body>

</html>