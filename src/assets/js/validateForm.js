import {
  startLocation,
  destinationLocation,
  deliveryPoints,
} from "./autocomplate.js";
import { renderResponse } from "./renderResponse.js";

const btnFinalize = $("#finalize-button");
const spantolls = $("#span-tolls");
const checktolls = $("#tolls-checkbox");

checktolls.on("change", (e) => {
  console.log(e.target.checked);
  if (e.target.checked) {
    spantolls.addClass("bg-green-500");
  } else {
    spantolls.removeClass("bg-green-500");
  }
});

function toggleIconLoading() {
  $("#iconLoading").toggleClass("hidden");
  $("#textButton").toggleClass("hidden");
  $("#finalize-button").prop("disabled", function (i, v) {
    return !v;
  });
}

function validateForm() {
  if (!startLocation || !destinationLocation) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Selecciona una ubicación de inicio y destino.",
    });
    return false;
  }

  const axles = parseInt($("#select-type-vehicle").val());
  if (axles <= 1 || axles >= 8) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Selecciona un tipo de vehículo.",
    });
    return false;
  }

  return true;
}

btnFinalize.on("click", () => {
  if (!validateForm()) return;
  toggleIconLoading();

  const data = {
    startLocation,
    destinationLocation,
    deliveryPoints,
    axles: parseInt($("#select-type-vehicle").val()),
    tolls: checktolls.is(":checked"),
  };

  // consulta a un archivo json
  // $.ajax({
  //   type: "GET",
  //   // url: "../server/monterrey_cdmx.json",
  //   url: "../server/cdmx_colima_queretaro.json",
  //   dataType: "json",
  //   success: function (response) {
  //     renderResponse(response);
  //     toggleIconLoading();
  //   },
  //   error: function (error) {
  //     toggleIconLoading();
  //     Swal.fire({
  //       icon: "error",
  //       title: "Error",
  //       text: "Ocurrió un error al intentar cargar los datos.",
  //     });
  //   },
  // });

  $.ajax({
    type: "POST",
    url: "../server/travel_info.php",
    data: JSON.stringify(data),
    contentType: "application/json",
    success: function (response) {
      renderResponse(response);
      toggleIconLoading();
    },
    error: function (error) {
      toggleIconLoading();
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al intentar crear el envío.",
      });
    },
  });
});
