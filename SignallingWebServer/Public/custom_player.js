function addTransmitterClicked() {
    let descriptor = {
        ActorToAdd: "WirelessTX"
    };
    emitUIInteraction(descriptor);
    console.log(descriptor);
}