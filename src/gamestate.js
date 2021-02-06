const gamestate = {
    current: "INIT",
    //start the clock from 1
    clock: 1,
    tick() {
        this.clock++;
        console.log("clock", this.clock);
        return this.clock;
    }
};

export default gamestate;
