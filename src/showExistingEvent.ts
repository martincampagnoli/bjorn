// Define the type for cost details
interface CostDetails {
    date: string;
    description: string;
    amount: number;
}

// Define the type for participant costs
type ParticipantCosts = {
    [key: string]: CostDetails[] | undefined; // Each participant's costs are stored as an array of CostDetails
};

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

    // Use the ParticipantCosts type for participantCosts
    let participantCosts: ParticipantCosts = JSON.parse(localStorageParticipantCosts) as ParticipantCosts;

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
       participants.forEach(participant => {
            const p: HTMLElement = document.createElement("p");
            const costs: CostDetails[] = participantCosts[participant] || []; // Ensure it retrieves costs

            // Calculate total cost for the participant
            const totalCost: number = costs.reduce((sum, cost) => sum + cost.amount, 0);

            // Display participant with total costs
            p.innerHTML = `${participant} - Total Costs: €${totalCost.toFixed(2)} <br> Costs: <br>`;

            // Check if there are any costs before displaying
            if (costs.length > 0) {
                // Create cost display with delete buttons for each cost
                costs.forEach((cost, index) => {
                    const costItem: HTMLDivElement = document.createElement("div");
                    costItem.innerHTML = `€${cost.amount.toFixed(2)} on ${cost.date} for ${cost.description}`;

                    // Create a delete button for each cost
                    let deleteButton: HTMLButtonElement = document.createElement("button");
                    deleteButton.innerText = "Delete";

                    // Append the delete button to the cost item
                    costItem.appendChild(deleteButton);
                    p.appendChild(costItem); // Append cost item to participant paragraph

                    // Add event listener to the delete button for each cost item
                    deleteButton.addEventListener("click", () => {
                        console.log(`Delete clicked for cost: ${cost.description}`);
                        deleteCost(participant, index);
                        window.location.reload();
                    });
                });
            } else {
                // Indicate that there are no costs
                p.innerHTML += "No costs recorded.";
            }
            participantsContainer?.appendChild(p);
        });

    }

    // Remove participant button click event listener
    removeParticipantButton.addEventListener("click", () => {
        console.log("Remove button clicked"); // Debugging log
        const participantToRemove: string = removeParticipantInput.value.trim();
        console.log("Participant to remove:", participantToRemove); // Debugging log

        if (participantToRemove && participants.includes(participantToRemove)) {
        // Remove the participant from the list
            participants.splice(participants.indexOf(participantToRemove), 1);

            // Create a new object without the removed participant's costs
            const { [participantToRemove]: _, ...updatedParticipantCosts } = participantCosts;
            participantCosts = updatedParticipantCosts; // Assign the updated costs back

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
        } else {
            alert("Please enter a valid participant name to remove.");
        }
    });

    // Display the updated participants list
    displayParticipants();

    function deleteCost(participant: string, index: number): void {
        console.log(`Deleting cost for participant: ${participant}, index: ${index}`); // Debugging log
        // Check if the participant exists in the participantCosts object
        if (participantCosts[participant]) {
            console.log("Current costs before deletion: ", participantCosts[participant]); // Debugging log
            // Remove the specific cost entry using splice
            participantCosts[participant].splice(index, 1);

            console.log("Costs after deletion: ", participantCosts[participant]); // Debugging log

            // If the participant has no more costs, create a new object without that participant
            if (participantCosts[participant].length === 0) {
                const { [participant]: _, ...updatedParticipantCosts } = participantCosts;
                participantCosts = updatedParticipantCosts; // Assign the updated costs back
            }

            // Update localStorage with the modified costs
            localStorage.setItem("participantCosts", JSON.stringify(participantCosts));

            // Refresh the displayed participants and their costs
            displayParticipants();
        }
        else {
            console.log(`No costs found for participant: ${participant}`); // Debugging log
        }
    }

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

    // Add cost button click event listener
    addCostButton.addEventListener("click", () => {
        const costParticipantName: string = costParticipantNameInput.value.trim();
        const costAmountValue: number = parseFloat(costAmountInput.value.trim());
        const costDate: string = costDateInput.value.trim();
        const costDescription: string = costDescriptionInput.value.trim();

        if (costParticipantName && participants.includes(costParticipantName) && !isNaN(costAmountValue) && costAmountValue >= 0 && costDate && costDescription) {
            // Create an object for the new cost
            const newCostDetail: CostDetails = {
                date: costDate,
                description: costDescription,
                amount: costAmountValue,
            };

            // Directly initialize if not present using logical nullish assignment
            participantCosts[costParticipantName] ??= []; // Initializes to an empty array if undefined or null

            // Add the new cost detail to the participant's array of costs
            participantCosts[costParticipantName].push(newCostDetail);
            localStorage.setItem("participantCosts", JSON.stringify(participantCosts)); // Update costs in localStorage

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
