// =====================================================
// IFTAR NFC — GLOBAL APP
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initNFCStatus();
    updateDashboardStats();
});


// =====================================================
// THEME
// =====================================================

function initTheme() {

    const themeBtn = document.getElementById("themeBtn");

    const savedTheme = localStorage.getItem("iftar_theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark");

        if (themeBtn) {
            themeBtn.textContent = "☀️";
        }
    }

    if (themeBtn) {

        themeBtn.addEventListener("click", () => {

            document.body.classList.toggle("dark");

            const dark =
                document.body.classList.contains("dark");

            localStorage.setItem(
                "iftar_theme",
                dark ? "dark" : "light"
            );

            themeBtn.textContent =
                dark ? "☀️" : "🌙";
        });
    }
}


// =====================================================
// NFC STATUS
// =====================================================

function initNFCStatus() {

    const status = document.getElementById("nfcStatus");

    if (!status) return;

    if ("NDEFReader" in window) {

        status.textContent =
            "NFC disponible sur cet appareil.";

    } else {

        status.textContent =
            "NFC Web non disponible sur ce navigateur.";
    }
}


// =====================================================
// DASHBOARD DATA
// =====================================================

function getData(key) {

    try {

        return JSON.parse(
            localStorage.getItem(key)
        ) || [];

    } catch {

        return [];
    }
}


function updateDashboardStats() {

    const beneficiaries =
        getData("beneficiaries");

    const zones =
        getData("zones");

    const distributions =
        getData("distributions");


    const planned =
        beneficiaries.reduce(
            (total, item) =>
                total + Number(item.mealsPerDay || 0),
            0
        );


    const distributed =
        distributions
            .filter(item =>
                item.date === getToday()
            )
            .reduce(
                (total, item) =>
                    total + Number(item.quantity || 0),
                0
            );


    const beneficiaryElement =
        document.getElementById(
            "statBeneficiaries"
        );

    const plannedElement =
        document.getElementById(
            "statPlanned"
        );

    const distributedElement =
        document.getElementById(
            "statDistributed"
        );

    const zonesElement =
        document.getElementById(
            "statZones"
        );


    if (beneficiaryElement)
        beneficiaryElement.textContent =
            beneficiaries.length;


    if (plannedElement)
        plannedElement.textContent =
            planned;


    if (distributedElement)
        distributedElement.textContent =
            distributed;


    if (zonesElement)
        zonesElement.textContent =
            zones.length;
}


// =====================================================
// DATE
// =====================================================

function getToday() {

    const date = new Date();

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// =====================================================
// LOCAL STORAGE HELPERS
// =====================================================

function saveData(key, data) {

    localStorage.setItem(
        key,
        JSON.stringify(data)
    );
}


function loadData(key) {

    try {

        return JSON.parse(
            localStorage.getItem(key)
        ) || [];

    } catch {

        return [];
    }
}


// =====================================================
// DEMO DATA
// =====================================================

function initializeDemoData() {

    if (!localStorage.getItem("beneficiaries")) {

        saveData(
            "beneficiaries",
            []
        );
    }


    if (!localStorage.getItem("zones")) {

        saveData(
            "zones",
            []
        );
    }


    if (!localStorage.getItem("agents")) {

        saveData(
            "agents",
            []
        );
    }


    if (!localStorage.getItem("distributions")) {

        saveData(
            "distributions",
            []
        );
    }


    if (!localStorage.getItem("zoneDeliveries")) {

        saveData(
            "zoneDeliveries",
            []
        );
    }
}


// Initialize
initializeDemoData();