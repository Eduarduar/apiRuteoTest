<div class=" w-full lg:!container lg:mx-auto p-6" id="app">
    <div class="bg-white rounded-lg grid gap-8">

        <div class="grid grid-cols-4 justify-center gap-4">
            <div class="grid grid-cols-2 col-span-4 2xl:col-span-3 gap-2">
                <div class="grid lg:grid-cols-2 gap-8 col-span-2">
                    <div class="space-y-6 col-span-2 lg:col-span-1">
                        <h2 class="text-2xl font-bold text-blue-600 flex flex-row justify-start items-center gap-1">Ubicaciones<?php include './assets/svg/mapPin.svg'; ?></h2>
                        <div>
                            <label
                                for="start-input"
                                class="block text-sm font-medium text-gray-700">Ubicación de Inicio</label>
                            <input
                                id="start-input"
                                type="text"
                                placeholder="Ingrese la ubicación de inicio"
                                class="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label
                                for="destination-input"
                                class="block text-sm font-medium text-gray-700">Ubicación de Destino</label>
                            <input
                                id="destination-input"
                                type="text"
                                placeholder="Ingrese el destino"
                                class="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                    </div>

                    <div class="space-y-6 col-span-2 lg:col-span-1">
                        <h2 class="text-2xl font-bold text-green-600 flex flex-row items-center justify-start gap-1">
                            Agregar Paradas<?php include './assets/svg/mapPinCheck.svg'; ?>
                        </h2>
                        <div>
                            <label
                                for="delivery-input"
                                class="block text-sm font-medium text-gray-700">Ubicación de Parada</label>
                            <input
                                id="delivery-input"
                                type="text"
                                placeholder="Ingrese la ubicación de entrega"
                                class="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500" />
                        </div>
                        <div>
                            <input
                                id="tolls-checkbox"
                                checked
                                type="checkbox"
                                class="hidden" />
                            <label
                                for="tolls-checkbox"
                                class="text-sm font-medium text-gray-700 flex flex-row items-center gap-2 cursor-pointer w-fit">
                                <span id="span-tolls" class="border-[3px] border-green-500 text-white rounded-md !w-5 !h-5 flex justify-center items-center bg-green-500"></span>
                                <span class="select-none">Preferir rutas con peajes</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div class="gap-8 col-span-2">
                    <div class="space-y-6">
                        <h2 class="text-2xl font-bold text-blue-600 flex flex-row justify-start items-center gap-1">
                            Vehículo<?php include './assets/svg/truck.svg'; ?>
                        </h2>
                        <div class="flex flex-col-reverse  md:flex-row md:items-center gap-2">
                            <div class="flex-[0.3] flex justify-center items-center min-h-[100px] border py-2 rounded-lg bg-blue-500/10">
                                <img
                                    id="vehicle-image"
                                    src="assets/img/2AxlesTruck.png"
                                    alt="truck"
                                    class="max-w-[150px]" />
                            </div>
                            <div class="flex-[0.7]">
                                <label
                                    for="km-litro"
                                    class="block text-sm font-medium text-gray-700">Cantidad de ejes</label>
                                <select id="select-type-vehicle" class="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                                    <option value="2">Camión de 2 ejes</option>
                                    <option value="3">Camión de 3 ejes</option>
                                    <option value="4">Camión de 4 ejes</option>
                                    <option value="5">Camión de 5 ejes</option>
                                    <option value="6">Camión de 6 ejes</option>
                                    <option value="7">Camión de 7 ejes</option>
                                </select>
                            </div>
                        </div>
                        <!-- radioButtons for type vehicle -->
                        <div class="flex flex-col items-center space-y-4 w-full" id="container-axles">
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-span-4 2xl:col-span-1">
                <div class="flex flex-col space-y-4 w-full h-full">
                    <div class="flex justify-between items-center">
                        <h2 class="text-2xl font-bold text-red-600 flex flex-row items-center justify-start gap-1">Ruta<?php include './assets/svg/route.svg'; ?></h2>
                        <button
                            id="clear-deliveries"
                            type="button"
                            class="bg-red-500 text-white p-2 rounded-md font-semibold hover:bg-red-600 transition">
                            <?php include './assets/svg/trash.svg'; ?>
                        </button>
                    </div>
                    <ul
                        id="deliveries-ul"
                        class="flex-grow space-y-4 border border-gray-200 p-4 rounded-md overflow-y-auto min-h-[440px] h-full bg-blue-500/10"></ul>
                </div>
            </div>
        </div>

        <div class="flex justify-end">
            <button
                id="finalize-button"
                type="button"
                class="bg-blue-500 text-white py-2 px-6 rounded-md font-semibold hover:bg-blue-600 transition flex flex-row justify-center items-center gap-2 min-h-[40px] min-w-[180px]">
                <span id="iconLoading" class="hidden">
                    <?php include './assets/svg/loading.svg'; ?>
                </span>
                <span id="textButton" class="flex flex-row justify-between items-center w-full"><?php include './assets/svg/check.svg'; ?>Calcular Ruta</span>
            </button>
        </div>
    </div>
</div>


<script src="assets/js/autocomplate.js" type="module" async defer></script>
<script src="assets/js/selectTypeVehicule.js" type="module" defer></script>
<script src="assets/js/validateForm.js" type="module" defer></script>