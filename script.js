const state = {
    floors: [],
    lifts: [],
    liftRequests: []
};

document.getElementById('config-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const numFloors = parseInt(document.getElementById('num-floors').value, 10);
    const numLifts = parseInt(document.getElementById('num-lifts').value, 10);

    initializeState(numFloors, numLifts);
    
    // Create UI based on the initial state
    createUI(numFloors, numLifts);
});

function initializeState(numFloors, numLifts) {
    state.floors = Array.from({ length: numFloors }, (_, i) => i + 1);
    state.lifts = Array.from({ length: numLifts }, (_, i) => ({
        id: i + 1,
        position: 1, // Default starting floor for each lift
        requests: []
    }));
    state.liftRequests = [];
}

function handleFloorButtonClick(floor) {
    state.liftRequests.push(floor);
    allocateLiftToFloor(floor);
}

function allocateLiftToFloor(floor) {
    let closestLift = state.lifts.reduce((prev, curr) => 
        Math.abs(curr.position - floor) < Math.abs(prev.position - floor) ? curr : prev
    );

    closestLift.requests.push(floor);
    processLiftRequests(closestLift);
}

function processLiftRequests(lift) {
    if (lift.requests.length === 0) return;

    const targetFloor = lift.requests.shift();
    moveLiftToFloor(lift.id, targetFloor);
}

function moveLiftToFloor(liftId, floor) {
    const liftElement = document.getElementById(`lift-${liftId}`);
    if (liftElement) {
        liftElement.classList.add('door-opening');
        setTimeout(() => {
            liftElement.classList.remove('door-opening');
            liftElement.style.transform = `translateY(${(state.floors.length - floor) * 100}px)`;
            liftElement.classList.add('door-closing');
            setTimeout(() => {
                liftElement.classList.remove('door-closing');
                processLiftRequests(state.lifts.find(l => l.id === liftId));
            }, 2500); // Duration for door closing
        }, 2500); // Duration for door opening
    }
}

function createUI(numFloors, numLifts) {
    const floorsContainer = document.getElementById('floors-container');
    const liftsContainer = document.getElementById('lifts-container');

    floorsContainer.innerHTML = '';
    liftsContainer.innerHTML = '';

    for (let i = 1; i <= numFloors; i++) {
        const floorDiv = document.createElement('div');
        floorDiv.classList.add('floor');
        floorDiv.id = `floor-${i}`;
        floorDiv.dataset.floor = i;

        const button = document.createElement('button');
        button.classList.add('call-lift');
        button.dataset.floor = i;
        button.textContent = `Floor ${i}`;

        button.addEventListener('click', () => handleFloorButtonClick(i));

        floorDiv.appendChild(button);
        floorsContainer.appendChild(floorDiv);
    }

    for (let i = 1; i <= numLifts; i++) {
        const liftDiv = document.createElement('div');
        liftDiv.classList.add('lift');
        liftDiv.id = `lift-${i}`;
        liftDiv.dataset.lift = i;

        liftsContainer.appendChild(liftDiv);
    }
}
