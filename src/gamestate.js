import { modFox, modScene } from "./ui";
import { RAIN_CHANCE, SCENES } from "./constants";

const gameState = {
    current: "INIT",
    //start the clock from 1
    clock: 1,
    wakeTime: -1, //not currently working 
    tick() {
        this.clock++;
        console.log("clock", this.clock);

        if (this.clock === this.wakeTime) {
            this.wake();
        }
        return this.clock;
    },
    // adding new state 
    startGame() {
        this.current = "HATCHING";
        this.wakeTime = this.clock + 2;
        modFox('egg');
        modScene('day');
    },
    //when hatching is not idle
    wake() {
        this.current = "IDLING";
        this.wakeTime = -1;
        modFox("idling");
        this.scene = Math.random() > RAIN_CHANCE ? 0 : 1;
        modScene(SCENES[this.scene]); //set the day/rain scene
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
