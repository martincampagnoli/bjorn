// voorbeeld #1
console.log("test");

function voorbeeld1(): void {
    const knopElement: HTMLButtonElement = document.querySelector("#voorbeeld1-knop")!;
    const resultaatElement: HTMLDivElement = document.querySelector("#voorbeeld1-resultaat")!;

    let aantalKliks: number = 0;

    knopElement.addEventListener("click", () => {
        aantalKliks++;

        resultaatElement.innerHTML = `Je hebt ${aantalKliks} geklikt!`;
    });
}

// Voorbeeld #2
function voorbeeld2(): void {
    const naamElement: HTMLInputElement = document.querySelector("#voorbeeld2-naam")!;
    const knopElement: HTMLButtonElement = document.querySelector("#voorbeeld2-knop")!;
    const resultaatElement: HTMLDivElement = document.querySelector("#voorbeeld2-resultaat")!;

    knopElement.addEventListener("click", () => {
        if (!naamElement.value) {
            resultaatElement.classList.add("error");
            resultaatElement.innerHTML = "Dat is geen geldige naam!";
        }
        else {
            resultaatElement.classList.remove("error");
            resultaatElement.innerHTML = `Hallo, ${naamElement.value}!`;
        }
    });
}

// Voorbeeld #3
function voorbeeld3(): void {
    const knopElement: HTMLButtonElement = document.querySelector("#voorbeeld3-knop")!;
    const resultaatElement: HTMLDivElement = document.querySelector("#voorbeeld3-resultaat")!;

    knopElement.addEventListener("click", () => {
        // Verwijder de bestaande inhoud van de pagina
        resultaatElement.replaceChildren();

        // Maak een image element en stel de Dokkie-afbeelding uit de ./wwwroot/public in
        const imageElement: HTMLImageElement = document.createElement("img");
        imageElement.width = 100;
        imageElement.height = 100;
        imageElement.src = "/dokkie.png";

        // Voeg het element aan de pagina toe
        resultaatElement.appendChild(imageElement);
    });
}
// Activeer de voorbeelden
voorbeeld1();
voorbeeld2();
voorbeeld3();
















function createEvent(): void {
    const submitButton: HTMLButtonElement = document.querySelector("#submitButton")!;
    const eventName: HTMLInputElement = document.getElementById("eventName") as HTMLInputElement;
    const amountOfPersons: HTMLInputElement = document.getElementById("amountOfPersons") as HTMLInputElement;
    const amount: HTMLInputElement = document.getElementById("amount") as HTMLInputElement;
    const tipEvents: HTMLInputElement = document.getElementById("tip") as HTMLInputElement;
    const participantsContainer: HTMLElement = document.getElementById("participantsContainer")!;
    const generateFieldsButton: HTMLButtonElement = document.querySelector("#generateFieldsButton")!; // **Add this line**

    // Function to validate and highlight empty fields
    const validateField: (field: HTMLInputElement) => boolean = field => {
        if (!field.value.trim()) {
            field.style.border = "2px solid red"; // Highlight empty field
            return false;
        } else {
            field.style.border = ""; // Remove highlight for non-empty field
            return true;
        }
    };

    // Generate participant fields based on number of participants
    generateFieldsButton.addEventListener("click", () => {
        participantsContainer.innerHTML = ""; // clear previous inputs
        const numParticipants: number = parseInt(amountOfPersons.value);

        // Ensure at least 2 participants
        if (numParticipants && numParticipants >= 2) {
            for (let i: number = 1; i <= numParticipants; i++) {
                const input: HTMLInputElement = document.createElement("input");
                input.type = "text";
                input.placeholder = `Participant ${i} Name`;
                input.id = `participantName${i}`;
                participantsContainer.appendChild(input);
                participantsContainer.appendChild(document.createElement("br"));
            }
        } else {
            alert("Please enter at least 2 participants.");
        }
    });

    // **Combined event listener for saving and submitting**
    submitButton.addEventListener("click", () => {
        const numParticipants: number = parseInt(amountOfPersons.value);

        // Check if all required fields are filled and number of participants is valid
        const isEventNameValid: boolean = validateField(eventName);
        const isAmountOfPersonsValid: boolean = validateField(amount);
        const isAmountValid: boolean = validateField(amount);

        // Validate all participant names
        let areParticipantsValid: boolean = true;
        const participants: Set<string> = new Set();
        let duplicateFound: boolean = false;

        for (let i: number = 1; i <= numParticipants; i++) {
            const participantField: HTMLInputElement = document.getElementById(`participantName${i}`) as HTMLInputElement;
            const participantName: string = participantField.value.trim();
            const isParticipantValid: boolean = validateField(participantField);

            // Check for empty or duplicate participant names
            if (!isParticipantValid || participants.has(participantName)) {
                participantField.style.border = "2px solid red"; // Highlight invalid field
                alert(`Participant names must be unique and not empty. Please check participant ${i}.`);
                areParticipantsValid = false;
                duplicateFound = true;
                break;
            } else {
                participantField.style.border = ""; // Remove highlight if input is valid
                participants.add(participantName);
            }
        }

        // If all fields are valid and no duplicates, proceed to store and redirect
        if (isEventNameValid && isAmountOfPersonsValid && isAmountValid && areParticipantsValid && !duplicateFound) {
            const tip: string = tipEvents.value || "0"; // Set default to "0" if no tip is provided

            // Store event details in localStorage
            localStorage.setItem("eventName", eventName.value);
            localStorage.setItem("amount", amount.value);
            localStorage.setItem("amountOfPersons", amountOfPersons.value);
            localStorage.setItem("tip", tip);
            localStorage.setItem("participants", JSON.stringify(Array.from(participants)));

            // **Show confirmation message**
            alert("Deelnemers succesvol opgeslagen en evenement verzonden!");

            // **Redirect to the "bestaand uitje" page**
            window.location.href = "bestaand-uitje.html";
        }
        else {
            alert("Please fill in all required fields and ensure there are no duplicate participant names.");
        }
    });
}

createEvent();
