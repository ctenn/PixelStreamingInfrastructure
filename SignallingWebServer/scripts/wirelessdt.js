// Additional functionality for Pixel Streaming the WirelessDT app.

const Actors = {
    /**
     * Define Actors in the WirelessDT app
     */
    WirelessTX: 'WirelessTX',
    MobileTwin: 'MobileTwin',
}

function setupActorUI(actorType) {
    /**
     * Notify the UE app to send setup data for actors of this type in this level.
     */
    let descriptor = {
        Start: actorType
    };
    emitUIInteraction(descriptor);
    console.log(descriptor);
}

function addActorClicked(actorType) {
    /**
     * Notify the UE app that a new actor of this type should be created.
     */
    let descriptor = {
        ActorToAdd: actorType
    };
    emitUIInteraction(descriptor);
    console.log(descriptor);
}

function updateActorLocation(id, type) {
    /**
     * Notify the UE app to update the location of the transmitter.
     */
    console.log(id);
    let txX = document.getElementById(id + "X");
    let txY = document.getElementById(id + "Y");
    let txZ = document.getElementById(id + "Z");

    // Validate that the coordinates are positive or negative floating points.
    if (isNaN(parseFloat(txX.value)) || isNaN(parseFloat(txY.value)) || isNaN(parseFloat(txZ.value))) {
        alert("Please enter valid numbers.");
    }

    let descriptor = {
        ActorToMove: id,
        ActorType: type,
        X: txX.value,
        Y: txY.value,
        Z: txZ.value
    };
    emitUIInteraction(descriptor);
    console.log(descriptor);
}

function selectTransmitter(id) {
    /**
     * Notify the UE app that this transmitter has been selected.
     */
    console.log(id);
    let descriptor = {
        TransmitterToSelect: id
    };
    emitUIInteraction(descriptor);
    console.log(descriptor);
}

function changeLevel() {
    /**
     * Notify the UE app to change the level.
     */
    let levels = document.getElementById("level-select");
    let selectedLevel = levels.options[levels.selectedIndex].text;

    let descriptor = {
        NewLevel: selectedLevel
    };
    emitUIInteraction(descriptor);

    console.log(descriptor);
}

function createActorUI(actorSection, actor) {
    /**
     * Create the UI element containing the actor name, location and update location button.
     */
    let actorName = actor.Name;

    let actorHeader = document.createElement('div');
    actorHeader.id = actorName + 'Header';
    actorHeader.className = 'settings-text';
    actorHeader.innerText = actorName;

    let actorContainer = document.createElement('div');
    actorContainer.id = actorName + 'ParamsContainer';
    actorContainer.className = 'collapse';

    let actorForm = document.createElement('div');
    actorForm.className = 'form-group';

    // Display the actor's coordinates.
    let coords = { "X": actor.X, "Y": actor.Y, "Z": actor.Z };
    for (const key in coords) {
        let actorCoord = document.createElement('input');
        actorCoord.type = 'number';
        actorCoord.className = 'form-control';
        actorCoord.id = actorName + key;
        actorCoord.value = coords[key];

        let actorCoordLabel = document.createElement('label');
        actorCoordLabel.htmlFor = actorName + key;
        actorCoordLabel.innerText = key + " Coord";

        actorForm.appendChild(actorCoordLabel);
        actorForm.appendChild(actorCoord);
    }

    let br = document.createElement('br');

    // Add the button to update each actor's location.
    let actorSubmit = document.createElement('input');
    actorSubmit.id = actorName;
    actorSubmit.type = 'button';
    actorSubmit.value = 'Apply';

    actorForm.appendChild(br);
    actorForm.appendChild(actorSubmit);
    actorContainer.appendChild(actorForm);

    actorSection.appendChild(actorHeader);
    actorSection.appendChild(actorContainer);
}

function initTransmitterUI(data) {
    /**
     * Use the Pixel Streaming response to set up the transmitter UI.
     */
    let txSection = document.getElementById('txLocation');
    txSection.innerHTML = '';

    // For each of the transmitters in the level, show their name and coordinates.
    for (const tx of data.WirelessTXs) {
        createActorUI(txSection, tx);

        let txSubmit = document.getElementById(tx.Name);
        txSubmit.onclick = function (event) {
            updateActorLocation(this.id, Actors.WirelessTX);
        }

        let txHeader = document.getElementById(tx.Name + 'Header');
        txHeader.onclick = function (event) {
            selectTransmitter(this.id.substring(0, this.id.indexOf("Header")));
        }
    }
}

function initMobileUI(data) {
    /**
     * Use the Pixel Streaming response to set up the mobile UI.
     */
    let mobileSection = document.getElementById('mobileTwinLocation');
    mobileSection.innerHTML = '';

    mobile = data.MobileTwin;

    let mobileAdd = document.getElementById('addMobileTwinBtn');

    // If there is no mobile data, enable the mobile Add button
    if (JSON.stringify(mobile) === JSON.stringify({})) {
        mobileAdd.disabled = false;
        return;
    }

    // Otherwise, create the mobile location UI and disable the mobile Add button
    createActorUI(mobileSection, mobile);

    let mobileSubmit = document.getElementById(mobile.Name);
    mobileSubmit.onclick = function (event) {
        updateActorLocation(this.id, Actors.MobileTwin);
    }

    mobileAdd.disabled = true;
}

function handlePixelStreamingResponse(data) {
    let jsonData = JSON.parse(data);
    if (jsonData.hasOwnProperty('WirelessTXs')) {
        initTransmitterUI(jsonData);
    } else if (jsonData.hasOwnProperty('MobileTwin')) {
        initMobileUI(jsonData);
    }
}