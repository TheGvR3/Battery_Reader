function initBattery() {
    const batteryLiquid = document.querySelector(".Bliquid");
    const batteryStatus = document.querySelector(".Bstatus");
    const Bpercentage = document.querySelector(".Bpercentage");

    navigator.getBattery().then((batt) => {
        const updateBattery = () => {
            const level = Math.floor(batt.level * 100);
            Bpercentage.textContent = `${level}%`;
            batteryLiquid.style.height = `${level}%`;

            if (level === 100) {
                batteryStatus.innerHTML = `Battery Full <i class="ri-battery-2-fill green-color"></i>`;
                batteryLiquid.style.height = "103%";
            } else if (level <= 20 && !batt.charging) {
                batteryStatus.innerHTML = `Low Charge <i class="ri-plug-line animated-red"></i>`;
            } else if (batt.charging) {
                batteryStatus.innerHTML = `Charging ... <i class="ri-flashlight-line animated-green"></i>`;
            } else {
                batteryStatus.innerHTML = "";
            }

            batteryLiquid.className = "Bliquid";  // Reset classes
            if (level <= 20) {
                batteryLiquid.classList.add("gradient-color-red");
            } else if (level <= 48) {
                batteryLiquid.classList.add("gradient-color-orange");
            } else if (level <= 80) {
                batteryLiquid.classList.add("gradient-color-yellow");
            } else {
                batteryLiquid.classList.add("gradient-color-green");
            }
        };

        updateBattery();
        batt.addEventListener("chargingchange", updateBattery);
        batt.addEventListener("levelchange", updateBattery);
    });
}

initBattery();
