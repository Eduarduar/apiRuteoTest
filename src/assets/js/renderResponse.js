import { createOptionRoute } from "./components/OptionsRoutes.js";
import { renderInfoRoute } from "./components/OptionRoute.js";

export function deleteResponse() {
  if ($("#containerResponse")) {
    $("#containerResponse").remove();
  }
}

export function renderResponse(data) {
  const app = $("#app");

  deleteResponse();

  const containerResponse = $("<div></div>", {
    class: "flex flex-col gap-4 mt-6 bg-white text-sm text-gray-700",
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

  containerResponse.append(containerOptionsRoutes);
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
      containerOptionsRoutes.after(inforRoute);
    }
  });

  app.append(containerResponse);
}
