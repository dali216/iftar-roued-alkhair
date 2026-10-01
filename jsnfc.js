// =====================================================
// NFC MODULE
// =====================================================

const scanBtn =
    document.getElementById("scanBtn");

const simulationBtn =
    document.getElementById(
        "simulationBtn"
    );

const scanMessage =
    document.getElementById(
        "scanMessage"
    );

const resultBox =
    document.getElementById(
        "beneficiaryResult"
    );

const beneficiaryName =
    document.getElementById(
        "beneficiaryName"
    );

const beneficiaryInfo =
    document.getElementById(
        "beneficiaryInfo"
    );

const mealQuantity =
    document.getElementById(
        "mealQuantity"
    );

const giveBtn =
    document.getElementById(
        "giveBtn"
    );


// =====================================================
// SCAN NFC
// =====================================================

async function scanNFC() {

    if (!("NDEFReader" in window)) {

        scanMessage.textContent =
            "❌ Web NFC n'est pas disponible sur cet appareil.";

        return;
    }


    try {

        const ndef =
            new NDEFReader();


        await ndef.scan();


        scanMessage.textContent =
            "📡 Approchez la carte NFC...";


        ndef.addEventListener(
            "reading",
            ({ serialNumber }) => {

                const uid =
                    serialNumber.toUpperCase();


                scanMessage.textContent =
                    `Carte détectée : ${uid}`;


                findBeneficiary(uid);

            }
        );


    } catch (error) {

        console.error(error);

        scanMessage.textContent =
            "❌ Impossible d'utiliser le NFC.";
    }
}


// =====================================================
// FIND BENEFICIARY
// =====================================================

function findBeneficiary(uid) {

    const beneficiaries =
        JSON.parse(
            localStorage.getItem(
                "beneficiaries"
            )
        ) || [];


    const beneficiary =
        beneficiaries.find(
            item =>
                String(item.nfcUid)
                    .toUpperCase()
                === uid
        );


    if (!beneficiary) {

        resultBox.classList.remove(
            "hidden"
        );

        beneficiaryName.textContent =
            "❌ Bénéficiaire introuvable";

        beneficiaryInfo.textContent =
            `UID : ${uid}`;

        giveBtn.disabled = true;

        return;
    }


    displayBeneficiary(
        beneficiary
    );
}


// =====================================================
// DISPLAY BENEFICIARY
// =====================================================

function displayBeneficiary(
    beneficiary
) {

    resultBox.classList.remove(
        "hidden"
    );


    beneficiaryName.textContent =
        beneficiary.name;


    beneficiaryInfo.textContent =
        `Zone : ${
            beneficiary.zone || "Non définie"
        } — ${
            beneficiary.mealsPerDay || 0
        } repas programmés`;


    mealQuantity.value =
        beneficiary.mealsPerDay || 1;


    giveBtn.disabled = false;


    giveBtn.onclick = () => {

        giveMeal(
            beneficiary
        );

    };
}


// =====================================================
// GIVE MEAL
// =====================================================

function giveMeal(
    beneficiary
) {

    const quantity =
        Number(
            mealQuantity.value
        );


    if (
        !quantity ||
        quantity <= 0
    ) {

        alert(
            "Veuillez saisir une quantité valide."
        );

        return;
    }


    const distributions =
        JSON.parse(
            localStorage.getItem(
                "distributions"
            )
        ) || [];


    const today =
        getToday();


    const alreadyGiven =
        distributions
            .filter(
                item =>
                    item.beneficiaryId
                    === beneficiary.id
                    &&
                    item.date
                    === today
            )
            .reduce(
                (
                    total,
                    item
                ) =>
                    total +
                    Number(
                        item.quantity
                    ),
                0
            );


    const remaining =
        Number(
            beneficiary.mealsPerDay
        ) - alreadyGiven;


    if (
        quantity > remaining
    ) {

        alert(
            `Il reste seulement ${remaining} repas pour aujourd'hui.`
        );

        return;
    }


    distributions.push({

        id:
            crypto.randomUUID(),

        beneficiaryId:
            beneficiary.id,

        beneficiaryName:
            beneficiary.name,

        quantity,

        date:
            today,

        time:
            new Date().toLocaleTimeString(
                "fr-FR"
            ),

        nfcUid:
            beneficiary.nfcUid

    });


    localStorage.setItem(
        "distributions",
        JSON.stringify(
            distributions
        )
    );


    alert(
        `✅ ${quantity} repas distribués à ${beneficiary.name}`
    );


    resultBox.classList.add(
        "hidden"
    );
}


// =====================================================
// SIMULATION
// =====================================================

function simulation() {

    const beneficiaries =
        JSON.parse(
            localStorage.getItem(
                "beneficiaries"
            )
        ) || [];


    if (
        beneficiaries.length === 0
    ) {

        alert(
            "Ajoutez d'abord un bénéficiaire."
        );

        return;
    }


    displayBeneficiary(
        beneficiaries[0]
    );


    scanMessage.textContent =
        "🧪 Mode simulation activé";
}


// =====================================================
// DATE
// =====================================================

function getToday() {

    const date =
        new Date();


    return [
        date.getFullYear(),

        String(
            date.getMonth() + 1
        ).padStart(2, "0"),

        String(
            date.getDate()
        ).padStart(2, "0")

    ].join("-");
}


// =====================================================
// EVENTS
// =====================================================

if (scanBtn) {

    scanBtn.addEventListener(
        "click",
        scanNFC
    );
}


if (simulationBtn) {

    simulationBtn.addEventListener(
        "click",
        simulation
    );
}