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
    const costParticipantSelect: HTMLSelectElement = document.getElementById("costParticipantSelect") as HTMLSelectElement;
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
    console.log("Participants array:", participants);

    // Use the ParticipantCosts type for participantCosts
    let participantCosts: ParticipantCosts = JSON.parse(localStorageParticipantCosts) as ParticipantCosts;

    // call the function to populate the dropdown immediately after retrieving participants
    populateParticipantDropdown();

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

    participantsContainer.addEventListener("click", (event: Event) => {
        const target: HTMLElement = event.target as HTMLElement;
    
        if (target.matches("button[id^='delete-btn-']")) {
            // Handle delete button clicks
            target.setAttribute("disabled", "true"); // Disable the button to prevent multiple clicks
    
            const idParts: string[] = target.id.split("-");
            const index: string = idParts[2];
            const participant: string = idParts.slice(3).join("-");
            console.log(`Delete button clicked for participant: ${participant}, index: ${index}`);
            try {
                deleteCost(participant, parseInt(index)); // Call deleteCost function
            } catch (error) {
                console.error("Error during delete action:", error);
            }
        } else if (target.matches("button[id^='edit-btn-']")) {
            // Handle edit button clicks
            const idParts: string[] = target.id.split("-");
            const index: string = idParts[2];
            const participant: string = idParts.slice(3).join("-");
            console.log(`Edit button clicked for participant: ${participant}, index: ${index}`);
            editCost(participant, parseInt(index)); // Call editCost function
        }
    });
    // After the move, your code should look like this:
    // typescript
    // Copy code
    // Function to display participants
    function displayParticipants(): void {
        participantsContainer.innerHTML = ""; // Clear previous list
        let grandTotal: number = 0; // Initialize grand total

        participants.forEach(participant => {
            const p: HTMLElement = document.createElement("p");
            const costs: CostDetails[] = participantCosts[participant] || []; // Ensure it retrieves costs

            // Calculate total cost for the participant
            const totalCost: number = costs.reduce((sum, cost) => sum + cost.amount, 0);
            grandTotal += totalCost; // Add to grand total

            // Display participant with total costs first
            p.innerHTML += `<strong>${participant} - Total Costs: €${totalCost.toFixed(2)}</strong><br> Costs:<br>`;

            // Check if there are any costs before displaying
            if (costs.length > 0) {
                // Create cost display with edit and delete buttons
                costs.forEach((cost, index) => {
                    const costItem: HTMLDivElement = document.createElement("div");
                    costItem.innerHTML = `€${cost.amount.toFixed(2)} on ${cost.date} for ${cost.description}`;

                    // Create and append the edit button
                    const editButton: HTMLButtonElement = document.createElement("button");
                    editButton.innerText = "Edit";
                    editButton.id = `edit-btn-${index}-${participant}`; // Use index to identify the button

                    // Create and append the delete button
                    const deleteButton: HTMLButtonElement = document.createElement("button");
                    deleteButton.innerText = "Delete";
                    deleteButton.id = `delete-btn-${index}-${participant}`; // Use index to identify the button

                    costItem.appendChild(editButton); // Append edit button to the cost item
                    costItem.appendChild(deleteButton); // Append button to the cost item
                    p.appendChild(costItem); // Append cost item to participant paragraph
                });
            } else {
                // Indicate that there are no costs
                p.innerHTML += "No costs recorded.";
            }
            participantsContainer.appendChild(p); // Add participant info to the container
        });

        // Display grand total amount at the end of the participant list
        const grandTotalElement: HTMLDivElement = document.createElement("div");
        grandTotalElement.innerHTML = `<strong>Grand Total for All Participants: €${grandTotal.toFixed(2)}</strong>`;
        participantsContainer.appendChild(grandTotalElement); // Append grand total to the container
    }

    // Move this block outside `displayParticipants` so it only runs once
    participantsContainer.addEventListener("click", (event: Event) => {
        const target: HTMLElement = event.target as HTMLElement;

        if (target.matches("button[id^='delete-btn-']")) {
            // Handle delete button clicks
            target.setAttribute("disabled", "true"); // Disable the button to prevent multiple clicks

            const idParts: string[] = target.id.split("-");
            const index: string = idParts[2];
            const participant: string = idParts.slice(3).join("-");
            console.log(`Delete button clicked for participant: ${participant}, index: ${index}`);
            try {
                deleteCost(participant, parseInt(index)); // Call deleteCost function
            } catch (error) {
                console.error("Error during delete action:", error);
            }
        } else if (target.matches("button[id^='edit-btn-']")) {
            // Handle edit button clicks
            const idParts: string[] = target.id.split("-");
            const index: string = idParts[2];
            const participant: string = idParts.slice(3).join("-");
            console.log(`Edit button clicked for participant: ${participant}, index: ${index}`);
            editCost(participant, parseInt(index)); // Call editCost function
        }
    });

    function editCost(participant: string, index: number): void {
        // Get the current cost details
        const currentCost: CostDetails | undefined = participantCosts[participant]?.[index];

        if (currentCost) {
            // Attempt to find the delete button first
            const deleteButton: Element | null = participantsContainer.querySelector(`#delete-btn-${index}-${participant}`);

            // Check if the delete button exists
            if (deleteButton) {
                // Get the parent element safely
                const costItem: HTMLDivElement = deleteButton.parentElement as HTMLDivElement;

                // Clear the current content and replace with input fields
                costItem.innerHTML = `
                    <input type="number" id="edit-cost-amount" value="${currentCost.amount}" />
                    <input type="date" id="edit-cost-date" value="${currentCost.date}" />
                    <input type="text" id="edit-cost-description" value="${currentCost.description}" />
                    <button id="confirm-edit-btn">Confirm</button>
                    <button id="cancel-edit-btn">Cancel</button>
                `;

                // Add event listeners for confirm and cancel buttons
                const confirmButton: HTMLElement = costItem.querySelector("#confirm-edit-btn") as HTMLButtonElement;
                const cancelButton: HTMLButtonElement = costItem.querySelector("#cancel-edit-btn") as HTMLButtonElement;

                confirmButton.addEventListener("click", () => {
                    const newAmount: number = parseFloat((costItem.querySelector("#edit-cost-amount") as HTMLInputElement).value);
                    const newDate: string = (costItem.querySelector("#edit-cost-date") as HTMLInputElement).value;
                    const newDescription: string = (costItem.querySelector("#edit-cost-description") as HTMLInputElement).value;

                    // Update the cost details
                    if (
                        participantCosts[participant] &&
                        !isNaN(newAmount) && newAmount >= 0 && newDate && newDescription) {
                        participantCosts[participant][index] = {
                            amount: newAmount,
                            date: newDate,
                            description: newDescription,
                        };

                        // Update localStorage
                        localStorage.setItem("participantCosts", JSON.stringify(participantCosts));

                        // Refresh the display
                        displayParticipants();
                    } else {
                        alert("Please enter valid values.");
                    }
                });

                cancelButton.addEventListener("click", () => {
                    // Refresh the display without saving changes
                    displayParticipants();
                });
            }
        } else {
            console.log(`No cost found at index ${index} for participant: ${participant}`);
        }
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
            populateParticipantDropdown(); // Update dropdown

            // Clear the input field after removing
            removeParticipantInput.value = "";
        }
        else {
            alert("Please enter a valid participant name to remove.");
        }
    });

    // Display the updated participants list
    displayParticipants();

    function deleteCost(participant: string, index: number): void {
        // Ensure the confirmation dialog only appears once
        const userConfirmed: boolean = confirm(`Are you sure you want to delete the cost for ${participant}?`);

        if (userConfirmed) {
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

                // Notify the user that the cost has been deleted
                showNotification(`${participant}'s cost at index ${index} has been successfully deleted.`);
            } else {
                console.log(`No costs found for participant: ${participant}`); // Debugging log
            }
        }
    }

    // Function to display a notification
    function showNotification(message: string): void {
        // Create a div for the notification
        const notification: HTMLDivElement = document.createElement("div");
        notification.classList.add("notification");
        notification.innerText = message;

        // Append it to the body
        document.body.appendChild(notification);

        // Set a timeout to remove the notification after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
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
            populateParticipantDropdown(); // Update dropdown

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
        const costParticipantName: string = costParticipantSelect.value;
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
            costParticipantSelect.selectedIndex = 0; // Reset the dropdown selection to the default option
            costAmountInput.value = "";
            costDateInput.value = "";
            costDescriptionInput.value = "";
        }
        else {
            alert("Please enter a valid participant name and a non-negative cost.");
        }
    });

    function populateParticipantDropdown(): void {
        // Clear previous options
        costParticipantSelect.innerHTML = "";

        // Log the dropdown element and the participants array
        console.log("Dropdown element:", costParticipantSelect); // Log the dropdown element
        console.log("Participants for dropdown:", participants); // Log the participants array

        // Add default "Select participant" option
        const defaultOption: HTMLOptionElement = document.createElement("option");
        defaultOption.text = "Select participant";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        costParticipantSelect.add(defaultOption);

        // Populate with participant names
        participants.forEach(participant => {
            const option: HTMLOptionElement = document.createElement("option");
            option.value = participant;
            option.text = participant;
            costParticipantSelect.add(option);

            if (participants.length === 0) {
                const emptyOption: HTMLOptionElement = document.createElement("option");
                emptyOption.text = "No participants available";
                emptyOption.disabled = true;
                costParticipantSelect.add(emptyOption);
            }
        });
    }

    function calculateAmountPerPerson(): number {
        // Example fixed amount for testing
        return 50; // Replace with your logic to calculate amount per person
    }

    function displayOverUnderPayments(amountPerPerson: number): void {
        const overUnderPaymentsContainer: HTMLElement | null = document.getElementById("overUnderPayments");
        if (!overUnderPaymentsContainer) return;

        overUnderPaymentsContainer.innerHTML = ""; // Clear previous results

        for (const participant of participants) {
            const costs: CostDetails[] = participantCosts[participant] || [];
            const participantTotal: number = costs.reduce((sum, cost) => sum + cost.amount, 0);

            const difference: number = participantTotal - amountPerPerson; // How much they overpaid or underpaid

            let statusMessage: string;
            if (difference > 0) {
                statusMessage = `${participant} has overpaid by €${difference.toFixed(2)}`;
            }
            else if (difference < 0) {
                statusMessage = `${participant} has underpaid by €${Math.abs(difference).toFixed(2)}`;
            }
            else {
                statusMessage = `${participant} has paid the exact amount.`;
            }

            const participantStatusElement: HTMLDivElement = document.createElement("div");
            participantStatusElement.textContent = statusMessage;
            overUnderPaymentsContainer.appendChild(participantStatusElement);
        }
    }

    // Set up the event listener for the button
    const calculateButton: HTMLElement | null = document.getElementById("calculateButton");
    calculateButton.addEventListener("click", () => {
        const amountPerPerson: number = calculateAmountPerPerson(); // Get the amount per person
        displayOverUnderPayments(amountPerPerson); // Call the display function
    });

    // Call the function to display over/under payments
}

showExistingEvent();
