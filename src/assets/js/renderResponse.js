import { createOptionRoute } from "./components/OptionsRoutes.js";
import { renderInfoRoute } from "./components/OptionRoute.js";

export function renderResponse(data) {
  const app = $("#app");

  if ($("#containerResponse")) {
    $("#containerResponse").remove();
  }

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
    const optionRoute = createOptionRoute(
      route,
      data.summary,
      index,
      containerResponse
    );
    containerOptionsRoutes.append(optionRoute);
    if (index === 0) {
      optionRoute.click();
      const inforRoute = renderInfoRoute(route, data.summary, index);
      setTimeout(() => {
        containerOptionsRoutes.after(inforRoute);
      }, 100);
    }
  });

  containerResponse.append(containerOptionsRoutes);
  app.append(containerResponse);
}
