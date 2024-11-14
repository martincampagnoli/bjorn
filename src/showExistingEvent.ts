interface CostDetails {
    participantName: string;
    date: string;
    description: string;
    amount: number;
    tip: number;
}

type ParticipantCosts = {
    [key: string]: CostDetails[] | undefined; 
};

function showExistingEvent(): void {

    function init(): void {
        const eventName: HTMLElement = document.getElementById("eventName")!;
        const amountOfPersonsContainer: HTMLElement = document.getElementById("amountOfPersons")!;
        const amountPerPersonElement: HTMLElement = document.getElementById("amountPerPerson")!;
        const participantsContainer: HTMLElement = document.getElementById("participantsContainer")!;
        const addParticipantButton: HTMLButtonElement = document.getElementById("addParticipantButton") as HTMLButtonElement;
        const newParticipantInput: HTMLInputElement = document.getElementById("newParticipantName") as HTMLInputElement;
        const removeParticipantButton: HTMLButtonElement = document.getElementById("removeParticipantButton") as HTMLButtonElement;
        const removeParticipantInput: HTMLInputElement = document.getElementById("removeParticipantName") as HTMLInputElement;
        const costParticipantSelect: HTMLSelectElement = document.getElementById("costParticipantSelect") as HTMLSelectElement;
        const costAmountInput: HTMLInputElement = document.getElementById("costAmount") as HTMLInputElement;
        const addCostButton: HTMLButtonElement = document.getElementById("addCostButton") as HTMLButtonElement;
        const eventContainer: HTMLButtonElement = document.getElementById("box1") as HTMLButtonElement;
        const costDateInput: HTMLInputElement = document.getElementById("costDate") as HTMLInputElement;
        const costDescriptionInput: HTMLInputElement = document.getElementById("costDescription") as HTMLInputElement;
        const calculateButton: HTMLElement | null = document.getElementById("calculateButton");
        const shareButton: HTMLButtonElement = document.getElementById("shareButton") as HTMLButtonElement;

        let events: string[] | any[] = [];

        if (localStorage.getItem("events")){
            events = JSON.parse(localStorage.getItem("events")!) || [];
        } 
        const currentEvent = events?  events[events.length-1] : null;
        console.log("CURRENT EVENT");
        console.log(currentEvent);

        const grandTotal: number = parseFloat(currentEvent.grandTotal);
        const amountPerPerson: number = grandTotal || 0 / parseInt(currentEvent.amountOfPersons);
        debugger;

        eventName.innerHTML = `Event Name: ${currentEvent.eventName}`;
        amountOfPersonsContainer.innerHTML = `Amount of people: ${currentEvent.amountOfPersons}`;
        amountPerPersonElement.innerHTML = `Amount per Person (with tip): ${amountPerPerson.toFixed(2)}`;

        participantsContainer.addEventListener("click", (event: Event) => {
            const target: HTMLElement = event.target as HTMLElement;
    
            if (target.matches("button[id^='delete-btn-']")) {
                const deleteButton: HTMLButtonElement = target as HTMLButtonElement; 
                deleteButton.setAttribute("disabled", "true"); 
                const idParts: string[] = target.id.split("-");
                const index: string = idParts[2];
                const participant: string = idParts.slice(3).join("-");
                try {
                    deleteCost(participant, parseInt(index), deleteButton, currentEvent);
                }
                catch (error) {
                    console.error("Error during delete action:", error);
                }
            }
            else if (target.matches("button[id^='edit-btn-']")) {
                const idParts: string[] = target.id.split("-");
                const index: string = idParts[2];
                const participant: string = idParts.slice(3).join("-");
                console.log(`Edit button clicked for participant: ${participant}, index: ${index}`);
                editCost(participant, parseInt(index), currentEvent, participantsContainer); 
            }
        });

        removeParticipantButton.addEventListener("click", () => {
            const participantToRemove: string = removeParticipantInput.value.trim();
            console.log("Participant to remove:", participantToRemove); 
    
            if (participantToRemove && currentEvent.participants.includes(participantToRemove)) {
                const userConfirmed: boolean = confirm(`Are you sure you want to delete ${participantToRemove}?`);
    
                if (userConfirmed) {
                    currentEvent.participants.splice(currentEvent.participants.indexOf(participantToRemove), 1);
    
                    const { [participantToRemove]: _, ...updatedParticipantCosts } = currentEvent.participantCosts;
                    currentEvent.participantCosts = updatedParticipantCosts; 
                    const newAmountOfPersons: number = currentEvent.participants.length;
                    
                    amountOfPersonsContainer.innerHTML = `Amount of people: ${newAmountOfPersons}`;

                    const amountPerPerson: number = calculateAmountPerPerson(currentEvent); 
                    displayOverUnderPayments(amountPerPerson, currentEvent); 
                    removeParticipantInput.value = "";
                }
            } else {
                alert("Please enter a valid participant name to remove.");
            }
        });

        addParticipantButton.addEventListener("click", () => {
            const newParticipantName: string = newParticipantInput.value.trim();

            if (newParticipantName && !currentEvent.participants.includes(newParticipantName)) {
                currentEvent.participants.push(newParticipantName);
                updateLocalStorage("participants", currentEvent.participants);

                // Update number of participants and save in localStorage
                const newAmountOfPersons: number = currentEvent.participants.length;
                amountOfPersonsContainer.innerHTML = `Amount of people: ${newAmountOfPersons}`;
                updateLocalStorage("amountOfPersons", newAmountOfPersons);

                // Clear the input field after adding
                newParticipantInput.value = "";
            }
            else {
                alert("Please enter a valid and unique participant name.");
            }
        });

        addCostButton.addEventListener("click", () => {
            const costParticipantName: string = costParticipantSelect.value;
            const costAmountValue: number = parseFloat(costAmountInput.value.trim());
            const costDate: string = costDateInput.value.trim();
            const costDescription: string = costDescriptionInput.value.trim();
            const tipPercentageValue: number = parseFloat((document.getElementById("tipPercentage") as HTMLInputElement).value.trim());

            let totalAmount: number = costAmountValue;

            let tipAmount: number = 0; // Initialize tipAmount
            if (!isNaN(tipPercentageValue) && tipPercentageValue > 0) {
                tipAmount = (costAmountValue * tipPercentageValue) / 100; // Calculate the tip amount
                totalAmount += tipAmount; // Add tip to total amount
            }

            if (costParticipantName && currentEvent.participants.includes(costParticipantName) && !isNaN(costAmountValue) && costAmountValue >= 0 && costDate && costDescription) {
                const newCostDetail: CostDetails = {
                    participantName: costParticipantName,
                    date: costDate,
                    description: costDescription,
                    amount: totalAmount, // Store the total amount (with tip included)
                    tip: tipAmount, // Store the tip amount separately
                };
                currentEvent.participantCosts = currentEvent.participantCosts || [];
                currentEvent.participantCosts.push(newCostDetail);

                events[events.length - 1] = currentEvent;

                updateLocalStorage("events", events);

                costParticipantSelect.selectedIndex = 0; // Reset the dropdown selection to the default option
                costAmountInput.value = "";
                costDateInput.value = "";
                costDescriptionInput.value = "";

                (document.getElementById("tipPercentage") as HTMLInputElement).value = "";
            } else {
                alert("Please enter a valid participant name and a non-negative cost.");
            }
        });

        let lastTransactions: string[] = [];

        calculateButton?.addEventListener("click", () => {
            const amountPerPerson: number = calculateAmountPerPerson(currentEvent); // Get the amount per person
            console.log(amountPerPerson);
            lastTransactions = displayOverUnderPayments(amountPerPerson, currentEvent); // Get transactions from display function
        });

        shareButton.addEventListener("click", () => {
            const amountPerPerson: number = calculateAmountPerPerson(currentEvent); // Get the amount per person again for sharing
            shareToWhatsApp(currentEvent.articipantCosts, amountPerPerson, lastTransactions); // Share with transactions included
        });

        window.addEventListener("storage", (event) => {
            console.dir(event);
            displayParticipants(participantsContainer, eventContainer, currentEvent);
            displayAmountPerPerson(currentEvent, amountOfPersonsContainer, amountPerPersonElement);
            populateParticipantDropdown(costParticipantSelect, currentEvent);
        });

        populateParticipantDropdown(costParticipantSelect, currentEvent);

        displayParticipants(participantsContainer, eventContainer, currentEvent);
    }
    function displayAmountPerPerson(currentEvent: any, amountOfPersonsContainer: any, amountPerPersonElement: any): void {
        const amountPerPerson: number = currentEvent.grandTotal / parseInt(currentEvent.amountOfPersons);
        amountOfPersonsContainer.innerHTML = `Amount of people: ${currentEvent.amountOfPersons}`;
        amountPerPersonElement.innerHTML = `Amount per Person (with tip): ${amountPerPerson.toFixed(2)}`;
    }
    function displayParticipants(participantsContainer: any, eventContainer: any,  currentEvent: any): void {
        participantsContainer.innerHTML = ""; // Clear previous list
        let grandTotal: number = 0; // Initialize grand total

        currentEvent.participants.forEach((participant: string | number) => {
            const p: HTMLElement = document.createElement("p");
            const costs: CostDetails[] = currentEvent.participantCosts.filter(
                (costDetail: CostDetails) => costDetail.participantName === participant
            );

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
            }
            else {
                // Indicate that there are no costs
                p.innerHTML += "No costs recorded.";
            }
            participantsContainer.appendChild(p); // Add participant info to the container
        });

        // Display grand total amount at the end of the participant list
        document.getElementById("grand-total")?.remove();
        const grandTotalElement: HTMLDivElement = document.createElement("div");
        grandTotalElement.id = "grand-total";
        grandTotalElement.innerHTML = `<strong>Grand Total for All Participants: €${grandTotal.toFixed(2)}</strong>`;
        eventContainer.appendChild(grandTotalElement); // Append grand total to the container
    }
    function editCost(participant: string, index: number, currentEvent: any, participantsContainer: HTMLElement): void {
        // Get the current cost details
        const currentCost: CostDetails | undefined = currentEvent.participantCosts[index];

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

                    // Get the new tip value, ensuring it defaults to 0 if invalid
                    const tipInput: string = (costItem.querySelector("#edit-cost-tip") as HTMLInputElement).value;
                    const newTip: number = !isNaN(parseFloat(tipInput)) && parseFloat(tipInput) >= 0 ? parseFloat(tipInput) : 0; // Ensure it's a valid non-negative number

                    // Update the cost details
                    if (
                        currentEvent.participantCosts[participant] &&
                        !isNaN(newAmount) && newAmount >= 0 && newDate && newDescription) {
                            currentEvent.participantCosts[participant][index] = {
                            amount: newAmount,
                            date: newDate,
                            description: newDescription,
                            tip: newTip,
                        };

                        updateLocalStorage("participantCosts", currentEvent.participantCosts);
                    }
                    else {
                        alert("Please enter valid values.");
                    }
                });

                cancelButton.addEventListener("click", () => {
                    window.location.reload();
                });
            }
        }
        else {
            console.log(`No cost found at index ${index} for participant: ${participant}`);
        }
    }
    function deleteCost(participant: string, index: number, deleteButton: HTMLButtonElement, currentEvent: any): void {
        console.log("Delete cost called for:", participant, index); // Debugging log
        // Ensure the confirmation dialog only appears once
        const userConfirmed: boolean = confirm(`Are you sure you want to delete the cost for ${participant}?`);

        if (userConfirmed) {
            console.log(`Deleting cost for participant: ${participant}, index: ${index}`); // Debugging log

            // Check if the participant exists in the participantCosts object
            if (currentEvent.participantCosts[participant]) {
                console.log("Current costs before deletion: ", currentEvent.participantCosts[participant]); // Debugging log

                // Remove the specific cost entry using splice
                currentEvent.participantCosts[participant].splice(index, 1);

                console.log("Costs after deletion: ", currentEvent.participantCosts[participant]); // Debugging log

                // If the participant has no more costs, create a new object without that participant
                if (currentEvent.participantCosts[participant].length === 0) {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { [participant]: _, ...updatedParticipantCosts } = currentEvent.participantCosts;
                    currentEvent.participantCosts = updatedParticipantCosts; // Assign the updated costs back
                }

                // Update localStorage with the modified costs
                updateLocalStorage("participantCosts", currentEvent.participantCosts);

                // Refresh the over-/under-payment display
                const amountPerPerson: number = calculateAmountPerPerson(currentEvent); // Recalculate amount per person
                displayOverUnderPayments(amountPerPerson, currentEvent); // Update over-/under-paid amounts

                // Notify the user that the cost has been deleted
                showNotification(`${participant}'s cost at index ${index} has been successfully deleted.`);
            }
            else {
                console.log(`No costs found for participant: ${participant}`); // Debugging log
            }
        }
        else {
            // Re-enable the delete button if user cancels
            deleteButton.removeAttribute("disabled");
        }
    }
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
    function populateParticipantDropdown(costParticipantSelect: any, currentEvent: any): void {
        // Clear previous options
        costParticipantSelect.innerHTML = "";

        // Log the dropdown element and the participants array
        console.log("Dropdown element:", costParticipantSelect); // Log the dropdown element
        console.log("Participants for dropdown:", currentEvent.participants); // Log the participants array

        // Add default "Select participant" option
        const defaultOption: HTMLOptionElement = document.createElement("option");
        defaultOption.text = "Select participant";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        costParticipantSelect.add(defaultOption);

        // Populate with participant names
        currentEvent.participants.forEach((participant: string) => {
            const option: HTMLOptionElement = document.createElement("option");
            option.value = participant;
            option.text = participant;
            costParticipantSelect.add(option);
        });
        if (currentEvent.participants.length === 0) {
            const emptyOption: HTMLOptionElement = document.createElement("option");
            emptyOption.text = "No participants available";
            emptyOption.disabled = true;
            costParticipantSelect.add(emptyOption);
        }
    }

    function calculateAmountPerPerson(currentEvent: any): number {
        return calculateGrandTotal(currentEvent.participantCosts) / parseInt(currentEvent.amountOfPersons);;
    }

    function calculateGrandTotal(participantCosts: ParticipantCosts): number {
        let grandTotal: number = 0;

        for (const participant in participantCosts) {
            const costs: CostDetails[] = participantCosts[participant] || [];
            grandTotal += costs.reduce((sum, cost) => sum + cost.amount, 0);
        }

        return grandTotal;
    }

    function displayOverUnderPayments(amountPerPerson: number, currentEvent: any): string[] { // Change return type to string[]
        const overUnderPaymentsContainer: HTMLElement | null = document.getElementById("overUnderPayments");
        if (!overUnderPaymentsContainer) return [];

        overUnderPaymentsContainer.innerHTML = ""; // Clear previous results

        // Create an object to hold the overpaid and underpaid amounts
        const paymentStatus: Record<string, number> = {};

        // Calculate how much each participant overpaid or underpaid
        for (const participant of currentEvent.participants) {
            const costs: CostDetails[] = currentEvent.participantCosts[participant] || [];
            const participantTotal: number = costs.reduce((sum, cost) => sum + cost.amount, 0);
            const difference: number = participantTotal - amountPerPerson; // How much they overpaid or underpaid

            paymentStatus[participant] = difference; // Store the amount in the paymentStatus object

            let statusMessage: string;
            if (difference > 0) {
                statusMessage = `${participant} has overpaid by €${difference.toFixed(2)}`;
            } else if (difference < 0) {
                statusMessage = `${participant} has underpaid by €${Math.abs(difference).toFixed(2)}`;
            } else {
                statusMessage = `${participant} has paid the exact amount.`;
            }

            const participantStatusElement: HTMLDivElement = document.createElement("div");
            participantStatusElement.textContent = statusMessage;
            overUnderPaymentsContainer.appendChild(participantStatusElement);
        }

        // Calculate who owes whom and display the transactions
        const transactions: string[] = [];
        for (const p1 in paymentStatus) {
            for (const p2 in paymentStatus) {
                if (paymentStatus[p1] > 0 && paymentStatus[p2] < 0) { // p1 overpaid and p2 underpaid
                    const amountToPay: number = Math.min(paymentStatus[p1], Math.abs(paymentStatus[p2]));
                    transactions.push(`${p2} needs to pay €${amountToPay.toFixed(2)} to ${p1}.`);
                    paymentStatus[p1] -= amountToPay; // Reduce the overpaid amount
                    paymentStatus[p2] += amountToPay; // Reduce the underpaid amount
                }
            }
        }

        // Display payment transactions
        if (transactions.length > 0) {
            const transactionsHeader: HTMLDivElement = document.createElement("div");
            transactionsHeader.textContent = "Payment Transactions:";
            overUnderPaymentsContainer.appendChild(transactionsHeader);

            transactions.forEach(transaction => {
                const transactionElement: HTMLDivElement = document.createElement("div");
                transactionElement.textContent = transaction;
                overUnderPaymentsContainer.appendChild(transactionElement);
            });
        } else {
            const noTransactionsElement: HTMLDivElement = document.createElement("div");
            noTransactionsElement.textContent = "No payments required.";
            overUnderPaymentsContainer.appendChild(noTransactionsElement);
        }

        return transactions; // Return transactions for sharing purposes
    }
    function formatPaymentResults(participantCosts: ParticipantCosts, amountPerPerson: number, transactions: string[]): string {
        let results: string = "Cost Splitting Results:\n\n";

        for (const participant in participantCosts) {
            const costs: CostDetails[] = participantCosts[participant] || [];
            const totalCost: number = costs.reduce((sum, cost) => sum + cost.amount, 0);
            const difference: number = totalCost - amountPerPerson;

            if (difference > 0) {
                results += `${participant} has overpaid by €${difference.toFixed(2)}\n`;
            }
            else if (difference < 0) {
                results += `${participant} has underpaid by €${Math.abs(difference).toFixed(2)}\n`;
            }
            else {
                results += `${participant} has paid exactly the right amount.\n`;
            }
        }

        // Add transactions to the results
        if (transactions.length > 0) {
            results += "\nPayment Transactions:\n";
            transactions.forEach(transaction => {
                results += `${transaction}\n`;
            });
        }
        else {
            results += "\nNo payments required.\n";
        }

        return results;
    }
    function shareToWhatsApp(participantCosts: ParticipantCosts, amountPerPerson: number, transactions: string[]): void {
        const results: string = formatPaymentResults(participantCosts, amountPerPerson, transactions);
        const whatsappMessage: string = encodeURIComponent(results); // Encode for URL
        const whatsappUrl: string = `https://api.whatsapp.com/send?text=${whatsappMessage}`;

        // Open WhatsApp
        window.open(whatsappUrl, "_blank");
    }

    function updateLocalStorage(key: string, value: any): void {
        localStorage.setItem(key, JSON.stringify(value));
        window.dispatchEvent(new Event("storage"));
    }

    init();
}
showExistingEvent();
