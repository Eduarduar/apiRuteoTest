import { renderMapRoute } from "./Map.js";
import { renderInfoRoute } from "./OptionRoute.js";

export function createOptionRoute(route, summary, index, containerResponse) {
  const isSelect =
    "flex flex-col rounded-lg px-6 py-2 bg-blue-500/20 hover:bg-blue-500/10 cursor-pointer transition-all ease-in-out duration-300 transform scale-110";
  const isNotSelect =
    "flex flex-col rounded-lg px-6 py-2 bg-gray-500/20 cursor-pointer transition-all ease-in-out duration-300 transform hover:scale-105";

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
    const inforRoute = renderInfoRoute(route, summary, index);
    renderMapRoute(route, index, containerResponse);

    $("#containerOptionsRoutes").after(inforRoute);
  });

  return containerOption;
}
