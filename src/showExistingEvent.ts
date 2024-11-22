/* eslint-disable @stylistic/padded-blocks */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/typedef */
interface CostDetails {
    participantName: string;
    date: string;
    description: string;
    amount: number;
    tip: number;
}

function showExistingEvent(): void {

    function init(): void {
        const amountOfPersonsParagraph: HTMLElement = document.getElementById("amount-of-persons")!;
        
        const participantsContainer: HTMLElement = document.getElementById("participants-container")!;

        const addParticipantButton: HTMLButtonElement = document.getElementById("add-participant-button") as HTMLButtonElement;
        const deleteParticipantButton: HTMLButtonElement = document.getElementById("delete-participant-button") as HTMLButtonElement;
        const shareButton: HTMLButtonElement = document.getElementById("share-button") as HTMLButtonElement;
        const addCostButton: HTMLButtonElement = document.getElementById("add-cost-button") as HTMLButtonElement;

        const newParticipantInput: HTMLInputElement = document.getElementById("new-participant-name") as HTMLInputElement;
        const costAmountInput: HTMLInputElement = document.getElementById("cost-amount") as HTMLInputElement;
        const costDateInput: HTMLInputElement = document.getElementById("cost-date") as HTMLInputElement;
        const costDescriptionInput: HTMLInputElement = document.getElementById("cost-description") as HTMLInputElement;

        const costParticipantSelect: HTMLSelectElement = document.getElementById("cost-participant-select") as HTMLSelectElement;
        const deleteParticipantSelect: HTMLSelectElement = document.getElementById("delete-participant-select") as HTMLSelectElement;

        let events: string[] | any[] = [];
        let lastTransactions: string[] = [];
        let eventIndex: number;

        if (localStorage.getItem("events")){
            events = JSON.parse(localStorage.getItem("events")!) || [];
        } 

        if (events.length === 0) {
            window.location.href = "create-events.html";
        }

        if (localStorage.getItem("ID")){
            eventIndex = JSON.parse(localStorage.getItem("ID")!);
        }
        else {
           eventIndex = events.length - 1;
        }

        const currentEvent = events ?  events[eventIndex] : null;
        
        refreshView(currentEvent);

        participantsContainer.addEventListener("click", (event: Event) => {
            const target: HTMLElement = event.target as HTMLElement;
    
            if (target.matches("button[id^='delete-btn-']")) {
                const deleteButton: HTMLButtonElement = target as HTMLButtonElement; 
                const idParts: string[] = target.id.split("-");
                const index: string = idParts[2];
                const participant: string = idParts.slice(3).join("-");
                deleteButton.setAttribute("disabled", "true"); 

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

        deleteParticipantButton.addEventListener("click", () => {
            const participantToRemove: string = deleteParticipantSelect.value.trim();
    
            if (participantToRemove && currentEvent.participants.includes(participantToRemove)) {
                const userConfirmed: boolean = confirm(`Are you sure you want to delete ${participantToRemove}?`);
    
                if (userConfirmed) {
                    currentEvent.participants.splice(currentEvent.participants.indexOf(participantToRemove), 1);
                    currentEvent.costs = currentEvent.costs.filter((cost: any) => cost.participantName !== participantToRemove);
                    updateStoredEvents(currentEvent); 
                    deleteParticipantSelect.value = "";
                }
            } else {
                alert("Please enter a valid participant name to remove.");
            }
        });

        addParticipantButton.addEventListener("click", () => {
            const newParticipantName: string = newParticipantInput.value.trim();
            let newAmountOfPersons: number;

            if (newParticipantName && !currentEvent.participants.includes(newParticipantName)) {
                currentEvent.participants.push(newParticipantName);
                newAmountOfPersons = currentEvent.participants.length;
                updateStoredEvents(currentEvent);
                newParticipantInput.value = "";
                amountOfPersonsParagraph.innerHTML = `Amount of people: ${newAmountOfPersons}`;
            }
            else {
                alert("Please enter a valid and unique participant name.");
            }
        });

        addCostButton.addEventListener("click", () => {
            const costParticipantName = costParticipantSelect.value;
            const costAmountValue = parseFloat(costAmountInput.value.trim());
            const costDate = costDateInput.value.trim();
            const costDescription = costDescriptionInput.value.trim();
            const tipPercentageValue = parseFloat((document.getElementById("tip-percentage") as HTMLInputElement).value.trim());

            let totalAmount = costAmountValue;

            let tipAmount = 0; 
            if (!isNaN(tipPercentageValue) && tipPercentageValue > 0) {
                tipAmount = (costAmountValue * tipPercentageValue) / 100; 
                totalAmount += tipAmount; 
            }

            if (costParticipantName && currentEvent.participants.includes(costParticipantName) && !isNaN(costAmountValue) && costAmountValue >= 0 && costDate && costDescription) {
                const newCostDetail: CostDetails = {
                    participantName: costParticipantName,
                    date: costDate,
                    description: costDescription,
                    amount: totalAmount, 
                    tip: tipAmount, 
                };
                currentEvent.costs = currentEvent.costs || [];
                currentEvent.costs.push(newCostDetail);

                updateStoredEvents(currentEvent);
                costParticipantSelect.selectedIndex = 0; 
                costAmountInput.value = "";
                costDateInput.value = "";
                costDescriptionInput.value = "";

                (document.getElementById("tip-percentage") as HTMLInputElement).value = "";
            } else {
                alert("Please enter a valid participant name and a non-negative cost.");
            }
        })

        shareButton.addEventListener("click", () => {
            const amountPerPerson: number = calculateAmountPerPerson(currentEvent); 
            shareToWhatsApp(currentEvent, amountPerPerson, lastTransactions); 
        });

        window.addEventListener("storage", () => {
            refreshView(currentEvent);
        });
    }
    function refreshView(currentEvent: any): void {
        const eventNameParagraph: HTMLElement = document.getElementById("event-name")!;
        const amountOfPersonsParagraph: HTMLElement = document.getElementById("amount-of-persons")!;
        const amountPerPersonParagraph: HTMLElement = document.getElementById("amount-per-person")!;
        const participantsContainer: HTMLElement = document.getElementById("participants-container")!;
        const eventContainer: HTMLElement = document.getElementById("event-container")!;

        displaySummary(eventNameParagraph, amountOfPersonsParagraph, amountPerPersonParagraph, currentEvent);
        displayParticipants(participantsContainer, eventContainer, currentEvent);
        populateParticipantDropdown(currentEvent);
        displayOverUnderPayments(calculateAmountPerPerson(currentEvent), currentEvent);
    }
    function displaySummary(eventNameParagraph: any, amountOfPersonsParagraph: any, amountPerPersonParagraph: any, currentEvent: any): void {
        const grandTotal = calculateGrandTotal(currentEvent.costs);
        const amountPerPerson = (grandTotal || 0 ) / currentEvent.participants.length;
        eventNameParagraph.innerHTML = `Event Name: ${currentEvent.eventName}`;
        amountOfPersonsParagraph.innerHTML = `Amount of people: ${currentEvent.participants.length}`;
        amountPerPersonParagraph.innerHTML = `Amount per Person (with tip): ${amountPerPerson.toFixed(2)}`;

    }
    function displayParticipants(participantsContainer: any, eventContainer: any, currentEvent: any): void {
        participantsContainer.innerHTML = "";
        const grandTotal = calculateGrandTotal(currentEvent.costs);

        currentEvent.participants.forEach((participant: string | number) => {
            const p: HTMLElement = document.createElement("p");
            const costs: CostDetails[] = currentEvent.costs.filter(
                (costDetail: CostDetails) => costDetail.participantName === participant
            );

            const totalCost: number = costs.reduce((sum, cost) => sum + cost.amount, 0);

            p.innerHTML += `<strong>${participant} - Total Costs: €${totalCost.toFixed(2)}</strong><br> Costs:<br>`;

            if (costs.length > 0) {
                costs.forEach((cost, index) => {
                    const costItem: HTMLDivElement = document.createElement("div");
                    costItem.innerHTML = `€${cost.amount.toFixed(2)} on ${cost.date} for ${cost.description}`;

                    const editButton: HTMLButtonElement = document.createElement("button");
                    editButton.innerText = "Edit";
                    editButton.id = `edit-btn-${index}-${participant}`;

                    const deleteButton: HTMLButtonElement = document.createElement("button");
                    deleteButton.innerText = "Delete";
                    deleteButton.id = `delete-btn-${index}-${participant}`; 

                    costItem.appendChild(editButton); 
                    costItem.appendChild(deleteButton); 
                    p.appendChild(costItem); 
                });
            }
            else {
                p.innerHTML += "No costs recorded.";
            }
            participantsContainer.appendChild(p); 
        });

        document.getElementById("grand-total")?.remove();
        const grandTotalElement: HTMLDivElement = document.createElement("div");
        grandTotalElement.id = "grand-total";
        grandTotalElement.innerHTML = `<strong>Grand Total for All Participants: €${grandTotal.toFixed(2)}</strong>`;
        eventContainer.appendChild(grandTotalElement); 
    }
    function editCost(participant: string, index: number, currentEvent: any, participantsContainer: HTMLElement): void {
        const currentCost: CostDetails | undefined = currentEvent.costs[index];

        if (currentCost) {
            const deleteButton: Element | null = participantsContainer.querySelector(`#delete-btn-${index}-${participant}`);

            if (deleteButton) {
                const costItem: HTMLDivElement = deleteButton.parentElement as HTMLDivElement;

                costItem.innerHTML = `
                    <input type="number" id="edit-cost-amount" value="${currentCost.amount}" />
                    <input type="date" id="edit-cost-date" value="${currentCost.date}" />
                    <input type="text" id="edit-cost-description" value="${currentCost.description}" />
                    <button id="confirm-edit-btn">Confirm</button>
                    <button id="cancel-edit-btn">Cancel</button>
                `;

                const confirmButton: HTMLElement = costItem.querySelector("#confirm-edit-btn") as HTMLButtonElement;
                const cancelButton: HTMLButtonElement = costItem.querySelector("#cancel-edit-btn") as HTMLButtonElement;

                confirmButton.addEventListener("click", () => {
                    const newAmount: number = parseFloat((costItem.querySelector("#edit-cost-amount") as HTMLInputElement).value);
                    const newDate: string = (costItem.querySelector("#edit-cost-date") as HTMLInputElement).value;
                    const newDescription: string = (costItem.querySelector("#edit-cost-description") as HTMLInputElement).value;

                    if (
                        currentEvent.costs[index] &&
                        !isNaN(newAmount) && newAmount >= 0 && newDate && newDescription) {
                            currentEvent.costs[index] = {...currentEvent.costs[index], amount: newAmount, date: newDate, description: newDescription };
                         updateStoredEvents(currentEvent);
                    }
                    else {
                        alert("Please enter valid values.");
                    }
                });

                cancelButton.addEventListener("click", () => {
                    refreshView(currentEvent);
                });
            }
        }
        else {
            console.log(`No cost found at index ${index} for participant: ${participant}`);
        }
    }

    function updateStoredEvents(updatedEvent: any): void {
        let index;
        const events: any[] = JSON.parse(localStorage.getItem("events")!) || [];
        if (localStorage.getItem("ID")){
            index = JSON.parse(localStorage.getItem("ID")!);
        }
        else {
            index = events.length - 1;
        }
        events[index] = updatedEvent;

        updateLocalStorage("events", events);
    }
    function deleteCost(participant: string, index: number, deleteButton: HTMLButtonElement, currentEvent: any): void {
        const userConfirmed: boolean = confirm(`Are you sure you want to delete the cost for ${participant}?`);

        if (userConfirmed) {
            if (currentEvent.costs[index]) {
                currentEvent.costs.splice(index, 1);
                updateStoredEvents(currentEvent);
                showNotification(`${participant}'s cost at index ${index} has been successfully deleted.`);
            }
            else {
                console.log(`No costs found for participant: ${participant}`);
            }
        }
        else {
            deleteButton.removeAttribute("disabled");
        }
    }
    function showNotification(message: string): void {
        const notification: HTMLDivElement = document.createElement("div");
        notification.classList.add("notification");
        notification.innerText = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    function populateParticipantDropdown(currentEvent: { participants: string[] }): void {
        const costParticipantSelect = document.getElementById("cost-participant-select") as HTMLSelectElement | null;
        const deleteParticipantSelect = document.getElementById("delete-participant-select") as HTMLSelectElement | null;

        if (!costParticipantSelect || !deleteParticipantSelect) {
            console.error("Participant select elements not found in the DOM.");
            return;
        }

        const createOption = (text: string, value: string | null = null, isDisabled: boolean = false): HTMLOptionElement => {
            const option = document.createElement("option");
            option.text = text;
            if (value !== null) option.value = value;
            option.disabled = isDisabled;
            return option;
        };

        costParticipantSelect.innerHTML = "";
        deleteParticipantSelect.innerHTML = "";

        costParticipantSelect.add(createOption("Select participant", null, true));
        deleteParticipantSelect.add(createOption("Select participant", null, true));

        if (currentEvent.participants.length > 0) {
            currentEvent.participants.forEach((participant) => {
                costParticipantSelect.add(createOption(participant, participant));
                deleteParticipantSelect.add(createOption(participant, participant));
            });
        } else {
            costParticipantSelect.add(createOption("No participants available", null, true));
            deleteParticipantSelect.add(createOption("No participants available", null, true));
        }
    }
    function calculateAmountPerPerson(currentEvent: any): number {
        return calculateGrandTotal(currentEvent.costs) / currentEvent.participants.length;
    }
    function calculateGrandTotal(costs: any): number {
        let grandTotal: number = 0;
        costs.forEach((cost: any) => { 
            grandTotal += cost.amount;
        }); 
        return grandTotal;
    }
    function displayOverUnderPayments(amountPerPerson: number, currentEvent: any): string[] { 
        const overUnderPaymentsContainer: HTMLElement | null = document.getElementById("over-under-payments");
        if (!overUnderPaymentsContainer) return [];

        overUnderPaymentsContainer.innerHTML = ""; 

        const paymentStatus: Record<string, number> = {};

        for (const participant of currentEvent.participants) {
            const costs: CostDetails[] = currentEvent.costs.filter(
                (costDetail: CostDetails) => costDetail.participantName === participant
            );
            const participantTotal: number = costs.reduce((sum, cost) => sum + cost.amount, 0);
            const difference: number = participantTotal - amountPerPerson;

            paymentStatus[participant] = difference;

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

        const transactions: string[] = [];
        for (const p1 in paymentStatus) {
            for (const p2 in paymentStatus) {
                if (paymentStatus[p1] > 0 && paymentStatus[p2] < 0) { 
                    const amountToPay: number = Math.min(paymentStatus[p1], Math.abs(paymentStatus[p2]));
                    transactions.push(`${p2} needs to pay €${amountToPay.toFixed(2)} to ${p1}.`);
                    paymentStatus[p1] -= amountToPay; 
                    paymentStatus[p2] += amountToPay; 
                }
            }
        }

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

        return transactions; 
    }
    function formatPaymentResults(currentEvent: any, amountPerPerson: number, transactions: string[]): string {
        let results: string = "Cost Splitting Results:\n\n";
        currentEvent.participants.forEach((participant: string) => {
            const costs: CostDetails[] = currentEvent.costs.filter(
                (costDetail: CostDetails) => costDetail.participantName === participant
            );
            const totalCost: number = costs.reduce((sum, cost) => sum + cost.amount, 0);
            const difference: number = totalCost - amountPerPerson;

            if (difference > 0) {
                results += `${participant} has overpaid by €${difference.toFixed(2)}\n`;
            } else if (difference < 0) {
                results += `${participant} has underpaid by €${Math.abs(difference).toFixed(2)}\n`;
            } else {
                results += `${participant} has paid exactly the right amount.\n`;
            }
        });
        
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
    function shareToWhatsApp(currentEvent: any, amountPerPerson: number, transactions: string[]): void {
        const results: string = formatPaymentResults(currentEvent, amountPerPerson, transactions);
        const whatsappMessage: string = encodeURIComponent(results);
        const whatsappUrl: string = `https://api.whatsapp.com/send?text=${whatsappMessage}`;

        window.open(whatsappUrl, "_blank");
    }
    function updateLocalStorage(key: string, value: any): void {
        localStorage.setItem(key, JSON.stringify(value));
        window.dispatchEvent(new Event("storage"));
    }

    init();
}

showExistingEvent();
