function createEvent(): void {
    const submitButton: HTMLButtonElement = document.querySelector("#submit-button")!;
    const eventNameParagraph: HTMLInputElement = document.getElementById("event-name") as HTMLInputElement;
    const amountOfPersonsParagraph: HTMLInputElement = document.getElementById("amount-of-persons") as HTMLInputElement;
    const participantsContainer: HTMLElement = document.getElementById("participants-container")!;
    const generateFieldsButton: HTMLButtonElement = document.querySelector("#generate-fields-button")!; 

    const validateField: (field: HTMLInputElement) => boolean = field => {
        if (!field.value.trim()) {
            field.style.border = "2px solid red"; // Highlight empty field
            return false;
        }
        else {
            field.style.border = ""; // Remove highlight for non-empty field
            return true;
        }
    };

    generateFieldsButton.addEventListener("click", () => {
        participantsContainer.innerHTML = ""; // clear previous inputs
        const numParticipants: number = parseInt(amountOfPersonsParagraph.value);

        // Ensure at least 2 participants
        if (numParticipants && numParticipants >= 2) {
            for (let i: number = 1; i <= numParticipants; i++) {
                const input: HTMLInputElement = document.createElement("input");
                input.type = "text";
                input.placeholder = `Participant ${i} Name`;
                input.id = `participant-name-${i}`;
                participantsContainer.appendChild(input);
                participantsContainer.appendChild(document.createElement("br"));
            }
        }
        else {
            alert("Please enter at least 2 participants.");
        }
    });

    submitButton.addEventListener("click", () => {
        const numParticipants: number = parseInt(amountOfPersonsParagraph.value);

        // Check if all required fields are filled and number of participants is valid
        const isEventNameValid: boolean = validateField(eventNameParagraph);
        const isAmountOfPersonsValid: boolean = validateField(amountOfPersonsParagraph);

        // Validate all participant names
        let areParticipantsValid: boolean = true;
        const participants: Set<string> = new Set();
        let duplicateFound: boolean = false;

        for (let i: number = 1; i <= numParticipants; i++) {
            const participantField: HTMLInputElement = document.getElementById(`participant-name-${i}`) as HTMLInputElement;
            const participantName: string = participantField.value.trim();
            const isParticipantValid: boolean = validateField(participantField);

            // Check for empty or duplicate participant names
            if (!isParticipantValid || participants.has(participantName)) {
                participantField.style.border = "2px solid red"; // Highlight invalid field
                alert(`Participant names must be unique and not empty. Please check participant ${i}.`);
                areParticipantsValid = false;
                duplicateFound = true;
                break;
            }
            else {
                participantField.style.border = ""; // Remove highlight if input is valid
                participants.add(participantName);
            }
        }
        const events: any = localStorage.getItem("events") ? JSON.parse(localStorage.getItem("events")!) : []
        // If all fields are valid and no duplicates, proceed to store and redirect
        if (isEventNameValid && isAmountOfPersonsValid && areParticipantsValid && !duplicateFound) {
            // Store event details in localStorage
            const newEvent: any = {eventName: eventNameParagraph.value, participants: Array.from(participants), participantCosts: [] };
            events.push(newEvent);
            localStorage.setItem("events", JSON.stringify(events));

            // **Show confirmation message**
            alert("participants succesfully saved");

            // **Redirect to the "bestaand uitje" page**
            window.location.href = "existing-events.html";
        }
        else {
            alert("Please fill in all required fields and ensure there are no duplicate participant names.");
        }
    });
}

createEvent();
