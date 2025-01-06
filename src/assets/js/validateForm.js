import {
  startLocation,
  destinationLocation,
  deliveryPoints,
} from "./autocomplate.js";
import { renderResponse } from "./renderResponse.js";

const btnFinalize = $("#finalize-button");

function toggleIconLoading() {
  $("#iconLoading").toggleClass("hidden");
  $("#textButton").toggleClass("hidden");
  $("#finalize-button").prop("disabled", function (i, v) {
    return !v;
  });
}

function validateForm() {
  if (!startLocation || !destinationLocation) {
    alert("Selecciona una ubicación de inicio y destino.");
    return false;
  }

  const axles = parseInt($("#select-type-vehicle").val());
  if (axles <= 1 && axles >= 8) {
    alert("Selecciona un tipo de vehículo.");
    return false;
  }

  return true;
}

btnFinalize.on("click", () => {
  // if (!validateForm()) return;
  toggleIconLoading();

  const data = {
    startLocation,
    destinationLocation,
    deliveryPoints,
    axles: parseInt($("#select-type-vehicle").val()),
  };

  // consulta a un archivo json
  // $.ajax({
  //   type: "GET",
  //   url: "../server/response test.json",
  //   dataType: "json",
  //   success: function (response) {
  //     renderResponse(response);
  //     toggleIconLoading();
  //   },
  //   error: function (error) {
  //     // toggleIconLoading();
  //     alert("Ocurrió un error al intentar crear el envío.");
  //   },
  // });

  $.ajax({
    type: "POST",
    url: "../server/travel_info.php",
    data: JSON.stringify(data),
    contentType: "application/json",
    success: function (response) {
      $("#containerResponse").remove();
      renderResponse(response);
      toggleIconLoading();
    },
    error: function (error) {
      toggleIconLoading();
      alert("Ocurrió un error al intentar crear el envío.");
    },
  });
});
