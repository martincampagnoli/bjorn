// Define types for participant events and the overall storage structure

// Event structure for each participant's event
interface Event {
    date: string; // Event date as a string (e.g., "2024-10-25")
    description: string; // Description of the event (e.g., "Dinner")
    amount: number; // Cost amount for the event
    tip: number; // Tip amount for the event
}

// Structure for all participants' events
interface ParticipantCosts {
    [participantName: string]: Event[];
}

// Retrieve participant data from localStorage or initialize an empty object
const getParticipantCosts: () => ParticipantCosts = (): ParticipantCosts => {
    return JSON.parse(localStorage.getItem("participantCosts") || "{}") as ParticipantCosts;
};

// Save participant data back to localStorage
function saveParticipantCosts(participantCosts: ParticipantCosts): void {
    localStorage.setItem("participantCosts", JSON.stringify(participantCosts));
}

function addEventForParticipant(participantName: string, event: Event): void {
    const participantCosts: ParticipantCosts = getParticipantCosts();

    // Assign an empty array if `participantCosts[participantName]` is undefined or null
    participantCosts[participantName] ??= [];

    // Add the new event to the participant's list of events
    participantCosts[participantName].push(event);

    // Save the updated participant data back to localStorage
    saveParticipantCosts(participantCosts);
}

// Event handler for adding a new event
function handleAddEvent(): void {
    // Example values; replace with actual inputs from the form on your page
    const participantName: string = (document.getElementById("participantNameInput") as HTMLInputElement).value;
    const eventDate: string = (document.getElementById("eventDateInput") as HTMLInputElement).value;
    const eventDescription: string = (document.getElementById("eventDescriptionInput") as HTMLInputElement).value;
    const eventAmount: number = parseFloat((document.getElementById("eventAmountInput") as HTMLInputElement).value);
    const eventTip: number = parseFloat((document.getElementById("eventTipInput") as HTMLInputElement).value);

    if (!participantName || !eventDate || !eventDescription || isNaN(eventAmount) || isNaN(eventTip)) {
        alert("Please fill in all fields correctly.");
        return;
    }

    const newEvent: Event = {
        date: eventDate,
        description: eventDescription,
        amount: eventAmount,
        tip: eventTip,
    };

    // Add event for the participant
    addEventForParticipant(participantName, newEvent);

    // Clear form fields (optional)
    (document.getElementById("participantNameInput") as HTMLInputElement).value = "";
    (document.getElementById("eventDateInput") as HTMLInputElement).value = "";
    (document.getElementById("eventDescriptionInput") as HTMLInputElement).value = "";
    (document.getElementById("eventAmountInput") as HTMLInputElement).value = "";
    (document.getElementById("eventTipInput") as HTMLInputElement).value = "";

    alert("Event added successfully!");
}

// Attach event listener to your form button (replace 'addEventButton' with the actual ID of your form button)
document.getElementById("addEventButton")?.addEventListener("click", handleAddEvent);
