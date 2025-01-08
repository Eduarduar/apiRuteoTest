import { renderMapRoute } from "./Map.js";
import { renderInfoRoute } from "./OptionRoute.js";

export function createOptionRoute(route, summary, index, containerResponse) {
  const isSelect =
    " bg-blue-500/20 hover:bg-blue-500/10 cursor-pointer scale-110";
  const isNotSelect = "bg-gray-500/20 cursor-pointer hover:scale-105";

  const classContainer =
    "flex flex-col rounded-lg px-6 py-2 transition-all ease-in-out duration-300 transform select-none";

  const containerOption = $("<div></div>", {
    class: classContainer + isNotSelect,
    text: `Ruta ${index + 1}`,
    id: `route-${index}`,
  });

  containerOption.on("click", () => {
    const options = $("#containerOptionsRoutes").children();
    options.each((index, element) => {
      $(element)
        .removeClass(classContainer + isSelect)
        .addClass(classContainer + isNotSelect);
    });

    if ($("#containerInfoRoute")) {
      $("#containerInfoRoute").remove();
    }

    containerOption
      .removeClass(classContainer + isNotSelect)
      .addClass(classContainer + isSelect);
    const inforRoute = renderInfoRoute(route, summary, index);
    renderMapRoute(route, index, containerResponse);

    $("#containerOptionsRoutes").after(inforRoute);
  });

  return containerOption;
}
