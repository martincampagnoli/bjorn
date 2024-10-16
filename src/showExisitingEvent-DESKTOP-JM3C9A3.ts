// Define the type for participant details
interface ParticipantDetails {
    date: string;
    description: string;
    amount: number;
}

function showExistingEvent(): void {
    // Select HTML elements
    const eventName: HTMLElement = document.getElementById("eventName")!;
    const amountOfPersons: HTMLElement = document.getElementById("amountOfPersons")!;
    const totalAmount: HTMLElement = document.getElementById("totalAmount")!;
    const tipElement: HTMLElement = document.getElementById("tipPercentage")!;
    const totalAmountWithTipElement: HTMLElement = document.getElementById("totalAmountWithTip")!;
    const amountPerPersonElement: HTMLElement = document.getElementById("amountPerPerson")!;
    const participantsContainer: HTMLElement = document.getElementById("participantsContainer")!;
    const addParticipantButton: HTMLButtonElement = document.getElementById("addParticipantButton") as HTMLButtonElement;
    const newParticipantInput: HTMLInputElement = document.getElementById("newParticipantName") as HTMLInputElement;
    const removeParticipantButton: HTMLButtonElement = document.getElementById("removeParticipantButton") as HTMLButtonElement;
    const removeParticipantInput: HTMLInputElement = document.getElementById("removeParticipantName") as HTMLInputElement;
    const costParticipantNameInput: HTMLInputElement = document.getElementById("costParticipantName") as HTMLInputElement;
    const costAmountInput: HTMLInputElement = document.getElementById("costAmount") as HTMLInputElement;
    const addCostButton: HTMLButtonElement = document.getElementById("addCostButton") as HTMLButtonElement;

    // Voeg de nieuwe selectie van elementen toe voor de datum en omschrijving
    const costDateInput: HTMLInputElement = document.getElementById("costDate") as HTMLInputElement;
    const costDescriptionInput: HTMLInputElement = document.getElementById("costDescription") as HTMLInputElement;

    // Retrieve event data from localStorage
    const localStorageEventName: string = localStorage.getItem("eventName") || "Unnamed Event";
    const localStorageAmount: string = localStorage.getItem("amount") || "0";
    const localStorageTip: string = localStorage.getItem("tip") || "0";
    const localStorageAmountOfPersons: string = localStorage.getItem("amountOfPersons") || "1";
    const localStorageParticipants: string = localStorage.getItem("participants") || "[]"; // Retrieve participants data
    const localStorageParticipantCosts: string = localStorage.getItem("participantCosts") || "{}"; // Retrieve participants costs

    // parse participants and costs from localstorage
    const participants: string[] = JSON.parse(localStorageParticipants) as string [];
    let participantCosts: { [key: string]: number | undefined } = JSON.parse(localStorageParticipantCosts) as { [key: string]: number };

    // Calculate tip and total amount with tip
    const tip: number = parseFloat(localStorageTip) / 100 + 1;
    const totalAmountWithTip: number = parseFloat(localStorageAmount) * tip;
    const amountPerPerson: number = totalAmountWithTip / parseInt(localStorageAmountOfPersons);

    // Display the retrieved and calculated data with labels
    eventName.innerHTML = `Event Name: ${localStorageEventName}`;
    amountOfPersons.innerHTML = `Amount of people: ${localStorageAmountOfPersons}`;
    totalAmount.innerHTML = `Total amount (without tip): ${parseFloat(localStorageAmount).toFixed(2)}`;
    tipElement.innerHTML = `Total tip: ${localStorageTip + "%"}`;
    totalAmountWithTipElement.innerHTML = `Total amount (with tip): ${totalAmountWithTip.toFixed(2)}`;
    amountPerPersonElement.innerHTML = `Amount per Person (with tip): ${amountPerPerson.toFixed(2)}`;

    // Function to display participants
    function displayParticipants(): void {
        participantsContainer.innerHTML = ""; // Clear previous list
        participants.forEach(participant => {
            const p: HTMLElement = document.createElement("p");
            const cost: number = participantCosts[participant] || 0;
            const participantDetails: ParticipantDetails | null = JSON.parse(localStorage.getItem(`${participant}_details`) || 'null') as ParticipantDetails | null;

            // Safely check if the details exist
            const date: string = participantDetails ? participantDetails.date : "no date";
            const description: string = participantDetails ? participantDetails.description : "no description"; // Retrieve description

            p.innerText = `${participant} - kosten: €${cost.toFixed(2)} - Date: ${date} - Description: ${description}`; // Display participant with cost
            participantsContainer.appendChild(p);
        });
    }

    displayParticipants(); // Display participants on page load

    // Add participant button click event listener
    addParticipantButton.addEventListener("click", () => {
        const newParticipantName: string = newParticipantInput.value.trim();

        if (newParticipantName && !participants.includes(newParticipantName)) {
            // Add the new participant to the list and update localStorage
            participants.push(newParticipantName);
            localStorage.setItem("participants", JSON.stringify(participants));

            // Update number of participants and save in localStorage
            const newAmountOfPersons: number = participants.length;
            amountOfPersons.innerHTML = `Amount of people: ${newAmountOfPersons}`;
            localStorage.setItem("amountOfPersons", newAmountOfPersons.toString());

            // Display the updated participants list
            displayParticipants();

            // Clear the input field after adding
            newParticipantInput.value = "";
            window.location.reload();
        }
        else {
            alert("Please enter a valid and unique participant name.");
        }
    });

    // Remove participant button click event listener
    removeParticipantButton.addEventListener("click", () => {
        const participantToRemove: string = removeParticipantInput.value.trim();

        if (participantToRemove && participants.includes(participantToRemove)) {
            // Remove the participant from the list
            participants.splice(participants.indexOf(participantToRemove), 1);

            // Create a new object without the removed participant's cost
            const { [participantToRemove]: _, ...updatedParticipantCosts } = participantCosts;
            participantCosts = updatedParticipantCosts;

            // OR use Option 2 if you want to create a new object
            // const { [participantToRemove]: removedCost, ...updatedParticipantCosts } = participantCosts;
            // participantCosts = updatedParticipantCosts;

            // Save updated data to localStorage
            localStorage.setItem("participants", JSON.stringify(participants));
            localStorage.setItem("participantCosts", JSON.stringify(participantCosts)); // Update costs in localStorage
            // Update number of participants
            const newAmountOfPersons: number = participants.length;
            amountOfPersons.innerHTML = `Amount of people: ${newAmountOfPersons}`;
            localStorage.setItem("amountOfPersons", newAmountOfPersons.toString());

            // Display the updated participants list
            displayParticipants();

            // Clear the input field after removing
            removeParticipantInput.value = "";
            window.location.reload();
        }
        else {
            alert("Please enter a valid participant name to remove.");
        }
    });

    // Add cost button click event listener
    addCostButton.addEventListener("click", () => {
        const costParticipantName: string = costParticipantNameInput.value.trim();
        const costAmountValue: number = parseFloat(costAmountInput.value.trim());
        const costDate: string = costDateInput.value.trim();
        const costDescription: string = costDescriptionInput.value.trim();

        if (costParticipantName && participants.includes(costParticipantName) && !isNaN(costAmountValue) && costAmountValue >= 0 && costDate && costDescription) {
        // Add cost to participant
            participantCosts[costParticipantName] = costAmountValue;
            localStorage.setItem("participantCosts", JSON.stringify(participantCosts)); // Update costs in localStorage

            // create an object to store details (date, description, amount)
            const participantDetails: ParticipantDetails = {
                date: costDate,
                description: costDescription,
                amount: costAmountValue,
            };

            // Save the details in localStorage, using the participant's name as the key
            localStorage.setItem(`${costParticipantName}_details`, JSON.stringify(participantDetails));

            // Display the updated participants list
            displayParticipants();

            // Clear the input fields after adding costs
            costParticipantNameInput.value = "";
            costAmountInput.value = "";
            costDateInput.value = "";
            costDescriptionInput.value = "";
        }
        else {
            alert("Please enter a valid participant name and a non-negative cost.");
        }
    });
}

showExistingEvent();
