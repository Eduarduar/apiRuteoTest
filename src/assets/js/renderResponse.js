export function renderResponse(data) {
  const app = $("#app");

  const containerResponse = $("<div></div>", {
    class:
      "flex flex-col gap-4 mt-6 bg-white shadow-lg rounded-lg p-8 border border-gray-200 text-sm text-gray-700",
    id: "containerResponse",
  });
  const header = $("<h2></h2>", {
    class: "flex flex-col",
  }).append(
    $("<span></span>", {
      class:
        "text-2xl font-bold text-blue-600 flex flex-row justify-start items-center gap-1",
      text: "Rutas",
    }).append(
      $("<img>", {
        src: "assets/svg/option.svg",
        alt: "Icono de rutas",
        class: "w-4 h-4",
      })
    ),
    $("<span></span>", {
      class: "text-sm font-semibold text-gray-500",
      text: "(Selecciona una ruta para ver la información)",
    })
  );

  containerResponse.append(header);

  const containerOptionsRoutes = $("<div></div>", {
    class: "flex flex-row gap-4",
    id: "containerOptionsRoutes",
  });

  // creamos las opciones de rutas
  data.routes.forEach((route, index) => {
    const optionRoute = createOptionRoute(route, index);
    containerOptionsRoutes.append(optionRoute);
    if (index === 0) {
      optionRoute.click();
      const inforRoute = renderInfoRoute(route, index);
      setTimeout(() => {
        containerOptionsRoutes.after(inforRoute);
      }, 100);
    }
  });

  containerResponse.append(containerOptionsRoutes);
  app.append(containerResponse);
}

function createOptionRoute(route, index) {
  const isSelect =
    "flex flex-col rounded-lg px-6 py-2 bg-blue-500/20 hover:bg-blue-500/10 cursor-pointer transition-all ease-in-out";
  const isNotSelect =
    "flex flex-col rounded-lg px-6 py-2 bg-gray-500/20 cursor-pointer";

  const containerOption = $("<div></div>", {
    class: isNotSelect,
    text: `Ruta ${index + 1}`,
    id: `route-${index}`,
  });

  containerOption.on("click", () => {
    // buscamos el elemento seleccionado
    const options = $("#containerOptionsRoutes").children();
    options.each((index, element) => {
      $(element).removeClass(isSelect).addClass(isNotSelect);
    });

    // comprobamos si existe un contenedor de información
    if ($("#containerInfoRoute")) {
      $("#containerInfoRoute").remove();
    }

    containerOption.removeClass(isNotSelect).addClass(isSelect);
    const inforRoute = renderInfoRoute(route, index);

    $("#containerOptionsRoutes").after(inforRoute);
  });

  return containerOption;
}

function renderInfoRoute(route, index) {
  const containerResponse = $("<div></div>", {
    class: "flex flex-col border rounded-lg p-2 w-full h-full",
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
      label: "Costo de gasolina",
      value: `$${formatNumber(route.costs.fuel.toFixed(2))} MXN`,
    },
  ];

  if (route.tolls.length) {
    info.push({ label: "Peajes", value: route.tolls.length });
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

  const containerButtonMap = $("<div></div>", {
    class: "flex justify-end mt-4",
  });

  const buttonMap = $("<button></button>", {
    class:
      "bg-green-500 text-white py-2 px-6 rounded-md font-semibold hover:bg-green-600 transition",
    text: "Ver Mapa de la Ruta",
    click: () => {
      window.open(route.summary.url, "_blank");
      // renderMapRoute(route, index);
    },
  });

  containerButtonMap.append(buttonMap);
  endInfo.append(containerButtonMap);

  containerResponse.append(endInfo);

  return containerResponse;
}
