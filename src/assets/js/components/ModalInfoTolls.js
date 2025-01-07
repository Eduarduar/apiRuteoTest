export function createModalInfoTolls(tolls, id) {
  const modal = $("<div></div>", {
    class: "modal fade",
    id: `modal-${id}`,
    tabindex: "-1",
    "aria-labelledby": `modal-${id}`,
    "aria-hidden": "true",
  });

  const modalDialog = $("<div></div>", {
    class: "modal-dialog modal-lg modal-dialog-scrollable",
  });

  const modalContent = $("<div></div>", {
    class: "modal-content",
  });

  const modalHeader = $("<div></div>", {
    class: "modal-header",
  }).append(
    $("<h1></h1>", {
      class: "modal-title fs-5",
      id: `modal-${id}`,
      text: "Información de Casetas y Tramos",
    }),
    $("<button></button>", {
      type: "button",
      class: "btn-close",
      "data-bs-dismiss": "modal",
      "aria-label": "Cerrar",
    })
  );

  const modalBody = $("<div></div>", {
    class:
      "modal-body scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200 scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar",
  });

  const grid = $("<div></div>", {
    class: "container",
  });

  tolls.forEach((toll) => {
    const isTramo = toll.type === "ticketSystem2";

    const row = $("<div></div>", {
      class: `row bg-light border rounded py-2 mb-3 shadow-sm`,
    });

    // Título principal
    row.append(
      $("<div></div>", {
        class: "col-12 fw-bold",
        text: isTramo
          ? `Tramo: ${toll.start.name} ➡ ${toll.end.name}`
          : `Caseta: ${toll.name || "Información no disponible"}`,
      })
    );

    // Subdetalles (carretera, estado, país)
    if (isTramo) {
      row.append(
        $("<div></div>", {
          class: "col-12 text-muted",
          text: `Carretera: ${toll.start.road} (${toll.start.state}, ${toll.start.country})`,
        })
      );
    }

    // Costos y detalles adicionales
    const costRow = $("<div></div>", {
      class: "col-12 d-flex flex-column",
    });

    costRow.append(
      $("<div></div>", {
        class: "text-primary mb-1",
        text: `Costo Efectivo: ${
          toll.cashCost ? `${toll.cashCost} ${toll.currency}` : "N/A"
        }`,
      }),
      $("<div></div>", {
        class: "d-flex justify-content-between align-items-center",
      }).append(
        $("<span></span>", {
          class: "text-success",
          text: `Costo TAG: ${
            toll.tagPriCost ? `${toll.tagPriCost} ${toll.currency}` : "N/A"
          }`,
        }),
        $("<span></span>", {
          class: "text-muted fst-italic",
          text: isTramo
            ? `Distancia: ${Math.round(toll.end.arrival.distance / 1000)} km`
            : "Información adicional: No aplica",
        })
      )
    );

    row.append(costRow);
    grid.append(row);
  });

  modalBody.append(grid);

  const modalFooter = $("<div></div>", {
    class: "modal-footer",
  }).append(
    $("<button></button>", {
      type: "button",
      class: "btn btn-secondary",
      "data-bs-dismiss": "modal",
      text: "Cerrar",
    })
  );

  modalContent.append(modalHeader, modalBody, modalFooter);
  modalDialog.append(modalContent);
  modal.append(modalDialog);

  return modal;
}
