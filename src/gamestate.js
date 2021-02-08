const gameState = {
    current: "INIT",
    //start the clock from 1
    clock: 1,
    wakeTime: -1, //not currently working 
    tick() {
        this.clock++;
        console.log("clock", this.clock);
        return this.clock;
    },
    // adding new state 
    startGame() {
        console.log("hatching");
        this.current = "HATCHING";
        this.wakeTime = this.clock + 2;
    },
    //when hatching is not idle
    wake() {
        console.log("awoken");
        this.current = "IDLING";
        this.wakeTime = -1;
    },
    //function is called, when someone clicks on button
    handleUserAction(icon) {
        if (["SLEEP", "FEEDING", "CELEBRATING", "HATCHING"].includes(this.current)) {
            // do nothing
            return;
        }

        if (this.current === "INIT" || this.current === "DEAD") {
            this.startGame();
            return;
        }

        switch (icon) {
            case "weather":
                this.changeWeather();
                break;
            case "poop":
                this.cleanUpPoop();
                break;
            case "fish":
                this.feed();
                break;
        }
    },
    changeWeather() {
        console.log("changeWeather");
    },
    cleanUpPoop() {
        console.log("cleanUpPoop");
    },
    feed() {
        console.log("feed");
    }
};

// binding the context to handleUserAction to always be like gameState
export const handleUserAction = gameState.handleUserAction.bind(gameState);
export default gameState;
