document.addEventListener("DOMContentLoaded", () => {

    initTheme();

    initNFCStatus();

    updateDashboardStats();

});


/* =========================
   THEME
========================= */

function initTheme() {

    const btn = document.getElementById("themeBtn");

    if (!btn) return;

    const savedTheme =
        localStorage.getItem("iftar_theme");

    if (savedTheme === "dark") {

        document.body.classList.add("dark");

        btn.textContent = "☀️";

    }

    btn.addEventListener("click", () => {

        document.body.classList.toggle("dark");

        const dark =
            document.body.classList.contains("dark");

        localStorage.setItem(
            "iftar_theme",
            dark ? "dark" : "light"
        );

        btn.textContent =
            dark ? "☀️" : "🌙";

    });

}


/* =========================
   NFC STATUS
========================= */

function initNFCStatus() {

    const box =
        document.getElementById("nfcStatus");

    if (!box) return;

    const text =
        box.querySelector("p");

    const dot =
        box.querySelector(".status-dot");

    if ("NDEFReader" in window) {

        text.textContent =
            "NFC disponible sur cet appareil.";

        dot.style.background =
            "#16805b";

    } else {

        text.textContent =
            "NFC Web non disponible. Utilisez le mode simulation.";

        dot.style.background =
            "#f0a500";

    }

}


/* =========================
   DASHBOARD
========================= */

function updateDashboardStats() {

    const beneficiaries =
        getData("beneficiaries");

    const zones =
        getData("zones");

    const distributions =
        getData("distributions");

    const statBeneficiaries =
        document.getElementById(
            "statBeneficiaries"
        );

    const statPlanned =
        document.getElementById(
            "statPlanned"
        );

    const statDistributed =
        document.getElementById(
            "statDistributed"
        );

    const statZones =
        document.getElementById(
            "statZones"
        );


    if (statBeneficiaries) {

        statBeneficiaries.textContent =
            beneficiaries.length;

    }


    if (statZones) {

        statZones.textContent =
            zones.length;

    }


    let planned = 0;

    beneficiaries.forEach(b => {

        planned +=
            Number(b.mealsPerDay || 0);

    });


    if (statPlanned) {

        statPlanned.textContent =
            planned;

    }


    let distributed = 0;

    distributions.forEach(d => {

        distributed +=
            Number(d.quantity || 0);

    });


    if (statDistributed) {

        statDistributed.textContent =
            distributed;

    }

}


/* =========================
   LOCAL STORAGE
========================= */

function getData(key) {

    try {

        return JSON.parse(
            localStorage.getItem(key)
        ) || [];

    } catch {

        return [];

    }

}


/* =========================
   DEMO DATA
========================= */

function initializeDemoData() {

    if (!localStorage.getItem("beneficiaries")) {

        localStorage.setItem(
            "beneficiaries",
            JSON.stringify([])
        );

    }

    if (!localStorage.getItem("zones")) {

        localStorage.setItem(
            "zones",
            JSON.stringify([])
        );

    }

    if (!localStorage.getItem("agents")) {

        localStorage.setItem(
            "agents",
            JSON.stringify([])
        );

    }

    if (!localStorage.getItem("distributions")) {

        localStorage.setItem(
            "distributions",
            JSON.stringify([])
        );

    }

    if (!localStorage.getItem("zoneDeliveries")) {

        localStorage.setItem(
            "zoneDeliveries",
            JSON.stringify([])
        );

    }

}
