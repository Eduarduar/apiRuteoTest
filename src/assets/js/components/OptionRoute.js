import { createModalInfoTolls } from "./ModalInfoTolls.js";

export function renderInfoRoute(route, summary, index) {
  const existTolls = route.tolls.length > 0;

  const containerResponse = $("<div></div>", {
    class: "flex flex-col w-full h-full",
    id: "containerInfoRoute",
  });

  const Title = $("<h2></h2>", {
    class: "text-xl font-bold text-blue-600",
    text: `Información de la ruta`,
  });

  containerResponse.append(Title);

  const gridInfo = $("<div></div>", {
    class: "grid grid-cols-1 md:grid-cols-2 gap-6",
  });

  const formatNumber = (num) =>
    num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const info = [
    {
      label: "Distancia",
      value: `${formatNumber(route.summary.distance.metric)}`,
    },
    { label: "Duración", value: route.summary.duration.text },
    {
      label: "Costo de combustible",
      value: `$${formatNumber(route.costs.fuel.toFixed(2))} MXN`,
    },
    {
      label: "Consumo de combustible",
      value: `${formatNumber(
        (route.costs.fuel / summary.fuelPrice.value).toFixed(2)
      )} litros`,
    },
  ];

  if (existTolls) {
    info.push({
      label: "Costo de peajes",
      value: `$${formatNumber(route.costs.cash)} MXN`,
    });
  }

  info.forEach((data) => {
    const containerInfo = $("<div></div>", {
      class: "flex items-center justify-between p-4 bg-gray-100 rounded-lg",
    });

    const label = $("<h3></h3>", {
      class: "text-lg font-semibold text-gray-800",
      text: data.label,
    });

    const value = $("<p></p>", {
      class: "text-xl font-bold text-blue-600",
      text: data.value,
    });

    containerInfo.append(label, value);
    gridInfo.append(containerInfo);
  });

  if (existTolls) {
    const ButtonTolls = $("<button></button>", {
      class:
        "flex items-center justify-between p-4 rounded-lg bg-blue-500/10 hover:bg-blue-100 transition-all duration-300 ease-in-out transform hover:scale-[1.02]",
      click: () => {
        $(`#modal-${index}`).modal("show");
      },
    });

    const label = $("<h3></h3>", {
      class: "text-lg font-semibold text-gray-800",
      text: "Ver información de peajes",
    });

    const value = $("<img></img>", {
      class: "w-4 h-4",
      src: "assets/svg/logs.svg",
    });

    ButtonTolls.append(label, value);
    gridInfo.append(ButtonTolls);

    const modal = createModalInfoTolls(route.tolls, index);
    containerResponse.append(modal);
  }

  containerResponse.append(gridInfo);

  const endInfo = $("<div></div>", {
    class: "flex items-center justify-between p-4 rounded-lg mt-4",
  });

  const endCosts = $("<h3></h3>", {
    class: "text-lg font-semibold text-gray-800",
    html: `Costo total: <span class="text-xl font-bold text-blue-600">$${formatNumber(
      (route.costs.fuel + route.costs.cash).toFixed(2)
    )} MXN</span>`,
  });

  endInfo.append(endCosts);

  containerResponse.append(endInfo);

  return containerResponse;
}
