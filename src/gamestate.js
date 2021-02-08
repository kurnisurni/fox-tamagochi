import { modFox, modScene } from "./ui";
import { RAIN_CHANCE, SCENES, DAY_LENGTH, NIGHT_LENGTH, getNextHungerTime, getNextDieTime } from "./constants";

const gameState = {
    current: "INIT",
    //start the clock from 1
    clock: 1,
    wakeTime: -1, //not currently working 
    sleepTime: -1,
    hungryTime: -1,
    dieTime: -1,
    tick() {
        this.clock++;
        console.log("clock", this.clock);

        if (this.clock === this.wakeTime) {
            this.wake();
        } else if (this.clock === this.sleepTime) {
            this.sleep();
        } else if (this.clock === this.hungryTime) {
            this.getHungry();
        } else if (this.clock === this.dieTime) {
            this.die();
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
        this.sleepTime = this.clock + DAY_LENGTH; //set the timer when it's going to go back to sleep
        this.hungryTime = getNextHungerTime(this.clock);
    },
    sleep() {
        this.state = "SLEEP";
        modFox("sleep");
        modScene("night");
        this.wakeTime = this.clock + NIGHT_LENGTH;
    },
    getHungry() {
        this.current = "HUNGRY";
        this.dieTime = getNextDieTime(this.clock);
        this.hungryTime = -1;
        modFox("hungry");
    },
    die() {
        console.log("die");
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
        if (this.current === !"HUNGRY") {
            return;
        }
        this.current = "FEEDING";
        this.dieTime = -1;
        this.poopTime = getNextPoopTime(this.clock);
        modFox("eating");
        this.timeToStartCelebrating = this.clock + 2;
    }
};

// binding the context to handleUserAction to always be like gameState
export const handleUserAction = gameState.handleUserAction.bind(gameState);
export default gameState;
