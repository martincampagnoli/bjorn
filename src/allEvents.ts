interface Event {
    date: string;
    description: string;
    amount: number;
    tip: number;
    eventName: string;
}

function AllEvents(): void {
    const events: any = JSON.parse(localStorage.getItem("events") || "[]");
    function displayEvents(): void {
        const eventResultsContainer: HTMLElement | null = document.getElementById("event-results");
        if (!eventResultsContainer) return;

        eventResultsContainer.innerHTML = ""; // Clear previous results

        if (events.length === 0) {
            eventResultsContainer.innerHTML = "<p>No events found.</p>";
            return;
        }

        // Create a table to display events
        const table: HTMLTableElement = document.createElement("table");
        table.classList.add("event-table");

        // Create table header
        const headerRow: HTMLTableRowElement = document.createElement("tr");
        const headers: string[] = ["Event Name"]; 
        headers.forEach(headerText => {
            const th: HTMLTableHeaderCellElement = document.createElement("th");
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        // Populate the table with event data
        events.forEach((event: Event, index: { toString: () => string | null; }) => {
            const row: HTMLTableRowElement = document.createElement("tr");

            // Assume description is the event name and amount is the number of people
            const eventNameCell: HTMLTableCellElement = document.createElement("td");
            eventNameCell.textContent = event.eventName; // Use event.description as the event name
            row.appendChild(eventNameCell);

            const eventIDCell: HTMLTableCellElement = document.createElement("td");
            eventIDCell.textContent = index.toString(); // Use event.description as the event name
            row.appendChild(eventIDCell);

            // Make the row clickable
            row.addEventListener("click", () => {
                localStorage.setItem("ID", index.toString()!);
                window.location.href = "existing-events.html";
            });

            table.appendChild(row);
        });

        eventResultsContainer.appendChild(table);
    }
    displayEvents();
}

AllEvents();
