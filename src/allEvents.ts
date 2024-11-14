interface Event {
    date: string;
    description: string;
    amount: number;
    tip: number;
}

interface ParticipantCosts {
    [participantName: string]: Event[];
}

const participantCosts: ParticipantCosts = JSON.parse(localStorage.getItem("participantCosts") || "{}") as ParticipantCosts;

function displayParticipantEvents(participantName: string): void {
    const eventResultsContainer: HTMLElement | null = document.getElementById("eventResults");
    if (!eventResultsContainer) return;

    eventResultsContainer.innerHTML = ""; // Clear previous results

    const events: Event[] = participantCosts[participantName] ?? []; // Defaults to empty array if not found

    if (events.length === 0) {
        eventResultsContainer.innerHTML = `<p>No events found for ${participantName}.</p>`;
        return;
    }

    // Create a table to display events
    const table: HTMLTableElement = document.createElement("table");
    table.classList.add("event-table");

    // Create table header
    const headerRow: HTMLTableRowElement = document.createElement("tr");
    const headers: string[] = ["Event Name", "Amount of People", "Date"]; // Specify type annotation
    headers.forEach(headerText => {
        const th: HTMLTableHeaderCellElement = document.createElement("th");
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Populate the table with event data
    events.forEach((event: Event) => {
        const row: HTMLTableRowElement = document.createElement("tr");

        // Assume description is the event name and amount is the number of people
        const eventNameCell: HTMLTableCellElement = document.createElement("td");
        eventNameCell.textContent = event.description; // Use event.description as the event name
        row.appendChild(eventNameCell);

        const amountCell: HTMLTableCellElement = document.createElement("td");
        amountCell.textContent = event.amount.toString(); // Use event.amount as the number of people
        row.appendChild(amountCell);

        const dateCell: HTMLTableCellElement = document.createElement("td");
        dateCell.textContent = event.date; // Use event.date
        row.appendChild(dateCell);

        // Make the row clickable
        row.addEventListener("click", () => {
            // Redirect to existing-events.html with a query parameter (or similar method)
            window.location.href = `existing-events.html?eventName=${encodeURIComponent(event.description)}`;
        });

        table.appendChild(row);
    });

    eventResultsContainer.appendChild(table);
}

// Event listener for the search button
document.getElementById("searchButton")?.addEventListener("click", () => {
    const participantName: string = (document.getElementById("participantNameInput") as HTMLInputElement).value.trim();
    if (participantName) {
        displayParticipantEvents(participantName);
    }
    else {
        alert("Please enter a participant name.");
    }
});
