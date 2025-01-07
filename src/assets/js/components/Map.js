export function renderMapRoute(route, index, containerMapRoute) {
  if ($("#containerMapRoute")) {
    $("#containerMapRoute").remove();
  }

  const container = $("<div></div>", {
    class: "relative flex flex-col w-full justify-center items-center",
    id: `containerMapRoute`,
  });

  const title = $("<h2></h2>", {
    text: "Mapa De La Ruta",
    class:
      "text-2xl font-bold text-blue-600 flex flex-row justify-start items-center gap-1",
  });

  const containerButtons = $("<div></div>", {
    class: "flex flex-row w-full items-center justify-end gap-2",
  });

  const fullscreenButton = $("<button></button>", {
    class: "p-2 bg-blue-600 text-white rounded z-10",
    click: () => {
      if (iframe[0].requestFullscreen) {
        iframe[0].requestFullscreen();
      } else if (iframe[0].mozRequestFullScreen) {
        iframe[0].mozRequestFullScreen();
      } else if (iframe[0].webkitRequestFullscreen) {
        iframe[0].webkitRequestFullscreen();
      } else if (iframe[0].msRequestFullscreen) {
        iframe[0].msRequestFullscreen();
      }
    },
  });

  const fullscreenIcon = $("<img>", {
    src: "assets/svg/expand.svg", // Add the image URL here
    alt: "Ampliar Mapa",
    class: "w-6 h-6",
  });

  fullscreenButton.append(fullscreenIcon);

  const openInNewWindowButton = $("<button></button>", {
    class: "p-2 bg-green-600 text-white rounded z-10",
    click: () => {
      window.open(route.summary.url, "_blank");
    },
  });

  const openInNewWindowIcon = $("<img>", {
    src: "assets/svg/arrowOut.svg", // Add the image URL here
    alt: "Abrir en Ventana Nueva",
    class: "w-6 h-6",
  });

  openInNewWindowButton.append(openInNewWindowIcon);

  const copyLinkButton = $("<button></button>", {
    class: "p-2 bg-yellow-600 text-white rounded z-10",
    click: () => {
      navigator.clipboard.writeText(route.summary.url).then(() => {
        alert("Link copiado al portapapeles");
      });
    },
  });

  const copyLinkIcon = $("<img>", {
    src: "assets/svg/link.svg", // Add the image URL here
    alt: "Copiar Link",
    class: "w-6 h-6",
  });

  copyLinkButton.append(copyLinkIcon);

  containerButtons.append(
    copyLinkButton,
    openInNewWindowButton,
    fullscreenButton
  );

  const apiKey = "AIzaSyAdWF8em7IWMS0_de5dV9qi_a1SshCYBW4";

  const iframeUrl = convertMapsLink(route.summary.url, apiKey);

  const iframe = $("<iframe></iframe>", {
    src: iframeUrl,
    class: "w-full h-[600px] mt-2 rounded-2xl shadow-lg",
    style: "border:0;",
    allowfullscreen: "",
    loading: "lazy",
  });

  container.append(title);
  container.append(containerButtons);
  container.append(iframe);
  setTimeout(() => {
    containerMapRoute.append(container);
  }, 300);
}

function convertMapsLink(originalUrl, apiKey) {
  const urlParams = new URL(originalUrl).searchParams;

  const origin = urlParams.get("saddr");
  const destination = urlParams.get("daddr").split("to:").pop();

  const waypoints = urlParams.get("daddr").split("to:").slice(0, -1).join("|");

  const iframeUrl = `https://www.google.com/maps/embed/v1/directions?key=${apiKey}&origin=${origin}&destination=${destination}&waypoints=${waypoints}`;

  return iframeUrl;
}
