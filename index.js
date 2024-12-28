function initBattery() {
    const batteryLiquid = document.querySelector(".Bliquid");
    const batteryStatus = document.querySelector(".Bstatus");
    const Bpercentage = document.querySelector(".Bpercentage");
    const controlButtons = document.querySelectorAll('.ctrl-btn');
    const chargingToggle = document.querySelector('.charging-toggle');
    const autoToggle = document.querySelector('.auto-toggle');
    
    let isCharging = false;
    let currentLevel = 100;
    let isAutoMode = false;
    let batteryAPI = null;

    // Funzione per aggiornare la visualizzazione della batteria
    const updateBatteryUI = (level, charging = isCharging) => {
        currentLevel = level;
        isCharging = charging;
        
        Bpercentage.textContent = `${level}%`;
        batteryLiquid.style.height = `${level}%`;

        if (level === 100) {
            batteryStatus.innerHTML = `Battery Full <i class="ri-battery-2-fill green-color"></i>`;
            batteryLiquid.style.height = "103%";
        } else if (level <= 20 && !charging) {
            batteryStatus.innerHTML = `Low Charge <i class="ri-plug-line animated-red"></i>`;
        } else if (charging) {
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

        // Aggiorna lo stato del pulsante di ricarica
        chargingToggle.classList.toggle('active', charging);
    };

    // Funzione per attivare/disattivare i controlli manuali
    const toggleControls = (enable) => {
        const buttons = document.querySelectorAll('.ctrl-btn:not(.auto-toggle)');
        buttons.forEach(btn => {
            btn.style.opacity = enable ? '1' : '0.5';
            btn.style.pointerEvents = enable ? 'auto' : 'none';
        });
    };

    // Event listeners per i pulsanti di controllo
    controlButtons.forEach(button => {
        if (!button.classList.contains('auto-toggle')) {
            button.addEventListener('click', () => {
                const level = button.dataset.level;
                if (level) {
                    updateBatteryUI(parseInt(level));
                }
            });
        }
    });

    // Event listener per il pulsante di ricarica
    chargingToggle.addEventListener('click', () => {
        isCharging = !isCharging;
        updateBatteryUI(currentLevel, isCharging);
    });

    // Event listener per il toggle automatico
    autoToggle.addEventListener('click', () => {
        isAutoMode = !isAutoMode;
        autoToggle.classList.toggle('active', isAutoMode);
        toggleControls(!isAutoMode);

        if (isAutoMode && batteryAPI) {
            // Aggiorna con i valori reali della batteria
            updateBatteryUI(Math.floor(batteryAPI.level * 100), batteryAPI.charging);
        }
    });

    // Inizializza con il 100%
    updateBatteryUI(100);

    // Configura l'API della batteria se disponibile
    if ('getBattery' in navigator) {
        navigator.getBattery().then((batt) => {
            batteryAPI = batt;
            
            batt.addEventListener("chargingchange", () => {
                if (isAutoMode) {
                    updateBatteryUI(Math.floor(batt.level * 100), batt.charging);
                }
            });
            
            batt.addEventListener("levelchange", () => {
                if (isAutoMode) {
                    updateBatteryUI(Math.floor(batt.level * 100), batt.charging);
                }
            });
        });
    }
}

initBattery();
