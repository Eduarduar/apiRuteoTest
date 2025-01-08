import { deleteResponse } from "./renderResponse.js";

const startInput = document.getElementById("start-input");
const destinationInput = document.getElementById("destination-input");
const deliveryInput = document.getElementById("delivery-input");
const deliveriesList = document.getElementById("deliveries-ul");
const clearDeliveriesButton = document.getElementById("clear-deliveries");
const modalApiruteo = document.getElementById("Modal-ApiRuteo");

export let startLocation = "";
export let destinationLocation = "";
export let deliveryPoints = [];

export function resetForm() {
  deleteResponse();
  startLocation = "";
  destinationLocation = "";
  deliveryPoints = [];
  startInput.value = "";
  destinationInput.value = "";
  deliveryInput.value = "";
  renderList();
}

function closeModalAndResetForm(e) {
  if (e.target !== modalApiruteo) return;
  resetForm();
  $("#Modal-ApiRuteo").modal("hide");
}

modalApiruteo.addEventListener("hidden.bs.modal", closeModalAndResetForm);

const autocompleteOptions = {
  fields: ["formatted_address", "geometry", "name", "place_id"],
};

async function loadAutoComplete() {
  // esperar a que se cargue la librería de google maps
  await new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAdWF8em7IWMS0_de5dV9qi_a1SshCYBW4&libraries=places`;
    script.async = true;
    script.onload = resolve;
    document.head.appendChild(script);
  });

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
      Swal.fire({
        icon: "error",
        title: "Ubicación no válida",
        text: "Por favor selecciona una ubicación válida de la lista desplegable.",
      });
    }
  });

  clearDeliveriesButton.addEventListener("click", () => {
    deliveryPoints = [];
    renderList();
  });
}

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
loadAutoComplete();
