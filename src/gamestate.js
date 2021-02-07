const gamestate = {
    current: "INIT",
    //start the clock from 1
    clock: 1,
    tick() {
        this.clock++;
        console.log("clock", this.clock);
        return this.clock;
    },
    //function is called, when someone clicks on button
    handleUserAction(icon) {
        console.log(icon);
    },
};

export default gamestate;
