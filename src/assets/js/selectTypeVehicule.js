import { vehicle } from "../../store/vehicle.js";

const selectTypeVehicle = $("#select-type-vehicle");
const imageVehicle = $("#vehicle-image");

selectTypeVehicle.on("change", function () {
  const filteredVehicle = vehicle.filter(
    (vehicle) => vehicle.axles === parseInt(this.value)
  );
  imageVehicle.attr("src", filteredVehicle[0].image);
});
