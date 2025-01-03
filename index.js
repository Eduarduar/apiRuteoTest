document.addEventListener("DOMContentLoaded", () => {
  const startInput = document.getElementById("start-input");
  const destinationInput = document.getElementById("destination-input");
  const deliveryInput = document.getElementById("delivery-input");
  const deliveriesList = document.getElementById("deliveries-ul");
  const resultContainer = document.getElementById("result");
  const finalizeButton = document.getElementById("finalize-button");
  const clearDeliveriesButton = document.getElementById("clear-deliveries");

  let startLocation = "";
  let destinationLocation = "";
  let deliveryPoints = [];

  const autocompleteOptions = {
    fields: ["formatted_address", "geometry", "name", "place_id"],
  };

  if (!window.google) {
    location.reload();
  }

  const startAutocomplete = new google.maps.places.Autocomplete(
    startInput,
    autocompleteOptions
  );
  const destinationAutocomplete = new google.maps.places.Autocomplete(
    destinationInput,
    autocompleteOptions
  );
  const deliveryAutocomplete = new google.maps.places.Autocomplete(
    deliveryInput,
    autocompleteOptions
  );

  finalizeButton.addEventListener("click", () => {
    if (!startLocation) {
      alert("Por favor selecciona una ubicación de inicio.");
      return;
    }

    if (!destinationLocation) {
      alert("Por favor selecciona una ubicación de destino.");
      return;
    }

    const kmToLt = $("#km-litro").val();
    const priceGas = $("#precio-gasolina").val();

    console.log(kmToLt, priceGas);
    if (!kmToLt || !priceGas) {
      alert("Por favor ingrese los datos de rendimiento de su vehículo.");
      return;
    }

    optimizeTours(kmToLt, priceGas);
  });

  startAutocomplete.addListener("place_changed", () => {
    const place = startAutocomplete.getPlace();
    if (place.geometry) {
      startLocation = {
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
        address: place.formatted_address,
        name: place.name,
      };
      renderList();
    }
  });

  destinationAutocomplete.addListener("place_changed", () => {
    const place = destinationAutocomplete.getPlace();
    if (place.geometry) {
      destinationLocation = {
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
        address: place.formatted_address,
        name: place.name,
      };
      renderList();
    }
  });

  deliveryAutocomplete.addListener("place_changed", () => {
    const place = deliveryAutocomplete.getPlace();
    if (place.geometry) {
      deliveryPoints.push({
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
        address: place.formatted_address,
        name: place.name,
      });
      deliveryInput.value = "";
      renderList();
    } else {
      alert(
        "Por favor selecciona una ubicación válida de la lista desplegable."
      );
    }
  });

  clearDeliveriesButton.addEventListener("click", () => {
    deliveryPoints = [];
    renderList();
  });

  function renderList() {
    deliveriesList.innerHTML = "";

    if (startLocation) {
      deliveriesList.appendChild(
        createListItem(`Inicio: ${startLocation.address}`, null, "start")
      );
    }

    deliveryPoints.forEach((point, index) => {
      deliveriesList.appendChild(
        createListItem(`Parada: ${point.address}`, index, "delivery")
      );
    });

    if (destinationLocation) {
      deliveriesList.appendChild(
        createListItem(
          `Destino: ${destinationLocation.address}`,
          null,
          "destination"
        )
      );
    }
  }

  function createListItem(text, index = null, type = "delivery") {
    const li = document.createElement("li");
    li.className = "p-2 border rounded-md flex justify-between items-center";

    if (type === "start") {
      li.className += " bg-green-100 border-green-500 text-green-700";
    } else if (type === "destination") {
      li.className += " bg-blue-100 border-blue-500 text-blue-700";
    } else {
      li.className += " bg-gray-50 border-gray-300";
    }

    const span = document.createElement("span");
    span.textContent = text;
    li.appendChild(span);

    if (type === "delivery") {
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Eliminar";
      deleteButton.className =
        "ml-4 bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600";
      deleteButton.addEventListener("click", () => {
        deliveryPoints.splice(index, 1);
        renderList();
      });
      li.appendChild(deleteButton);
    }

    return li;
  }

  renderList();

  function toggleIconLoading() {
    $("#iconLoading").toggleClass("hidden");
    $("#textButton").toggleClass("hidden");
    $("#finalize-button").prop("disabled", function (i, v) {
      return !v;
    });
  }

  async function optimizeTours(kmToLt, priceGas) {
    toggleIconLoading();

    const pointsRute = [startLocation, ...deliveryPoints, destinationLocation];
    let totalDistance = 0;
    let totalDuration = 0;
    const logResult = {};

    try {
      for (let i = pointsRute.length - 2; i >= 0; i--) {
        const origins = pointsRute[i];
        const destinations = pointsRute[i + 1];

        if (
          !origins.latitude ||
          !origins.longitude ||
          !destinations.latitude ||
          !destinations.longitude
        ) {
          throw new Error(
            "Las ubicaciones no tienen latitud y longitud válidas."
          );
        }

        const response = await $.ajax({
          url: "google-api-proxy/server.php",
          method: "POST",
          contentType: "application/json",
          data: JSON.stringify({
            origins: `${origins.latitude},${origins.longitude}`,
            destinations: `${destinations.latitude},${destinations.longitude}`,
          }),
        });

        if (
          !response.data ||
          !response.data.rows ||
          !response.data.rows[0].elements[0].distance ||
          !response.data.rows[0].elements[0].duration
        ) {
          if (response.data.rows[0].elements[0].status === "ZERO_RESULTS") {
            alert("La ruta que intenta calcular no es válida.");
          } else {
            throw new Error("Datos inválidos devueltos por la API.");
          }
          return;
        }

        const distance = response.data.rows[0].elements[0].distance.value;
        const duration = response.data.rows[0].elements[0].duration.value;
        totalDistance += distance;
        totalDuration += duration;

        logResult[`${i}`] = {
          origen: origins.address,
          origenName: origins.name,
          destino: destinations.address,
          destinoName: destinations.name,
          distancia: distance,
          duracion: duration,
          gasTotal: distance / 1000 / kmToLt,
          costoGas: (distance / 1000 / kmToLt) * priceGas,
        };
      }

      logResult["Ruta General"] = {
        origen: startLocation.address,
        originName: startLocation.name,
        destino: destinationLocation.address,
        destinoName: destinationLocation.name,
        distancia: totalDistance,
        duracion: totalDuration,
        gasTotal: totalDistance / 1000 / kmToLt,
        costoGas: (totalDistance / 1000 / kmToLt) * priceGas,
      };

      clearDataTable();
      for (const key in logResult) {
        insertDataToTable(logResult[key], key);
      }
    } catch (error) {
      console.error("Error durante la optimización de la ruta:", error);
    } finally {
      toggleIconLoading();
    }
  }
});

function createDataTable() {
  const table = $("#route-table");
  const classTR = "border-b border-gray-200 min-h-20 h-20 text-xl";

  table.dataTable({
    pageLength: 1000,
    lengthMenu: [
      [10, 25, 50, 100, -1],
      [10, 25, 50, 100, "Todos"],
    ],
    searching: false,
    lengthChange: false,
    info: false,
    paging: false,
    ordering: false,
    columnDefs: [
      { className: "dt-center", targets: "_all" },
      {
        targets: 0,
        visible: false,
      },
    ],
    stripeClasses: [`${classTR} !bg-gray-100`, `${classTR} !bg-green-500/20`],
    order: [[0, "asc"]],
  });

  table.DataTable().clear().draw();
}

function clearDataTable() {
  const table = $("#route-table").DataTable();
  table.clear().draw();
}

function insertDataToTable(data, key) {
  console.log(data);
  const table = $("#route-table").DataTable();

  const hours = Math.floor((data.duracion || 0) / 3600);
  const minutes = Math.floor(((data.duracion || 0) % 3600) / 60);

  let durationText =
    hours > 0 ? `${hours} ${hours > 1 ? "Horas" : "Hora"}` : "";
  if (minutes > 0) {
    durationText += ` ${minutes} minutos`;
  }

  const formattedCost = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(data.costoGas || 0);

  const rowNode = table.row
    .add([
      key === "Ruta General" ? -1 : key,
      key === "Ruta General"
        ? "Ruta Completa"
        : `De <strong>${data.origenName || ""}</strong> a <strong>${
            data.destinoName || ""
          }</strong>`,
      `${(data.distancia || 0) / 1000} km`,
      durationText,
      `${(data.gasTotal || 0).toFixed(2)} litros`,
      formattedCost,
    ])
    .draw()
    .node();

  if (key === "Ruta General") {
    $(rowNode)
      .removeClass("!bg-gray-100 !bg-green-500/20")
      .addClass("!bg-blue-100");
  }
}

createDataTable();
