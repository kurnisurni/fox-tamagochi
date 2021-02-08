import { modFox, modScene, togglePoopBag, writeModal } from "./ui";
import { RAIN_CHANCE, SCENES, DAY_LENGTH, NIGHT_LENGTH, getNextHungerTime, getNextDieTime, getNextPoopTime } from "./constants";

const gameState = {
    current: "INIT",
    //start the clock from 1
    clock: 1,
    wakeTime: -1, //not currently working 
    sleepTime: -1,
    hungryTime: -1,
    dieTime: -1,
    timeToStartCelebrating: -1,
    timeToEndCelebrating: -1,
    poopTime: -1,
    tick() {
        this.clock++;
        console.log("clock", this.clock, this);

        if (this.clock === this.wakeTime) {
            this.wake();
        } else if (this.clock === this.sleepTime) {
            this.sleep();
        } else if (this.clock === this.hungryTime) {
            this.getHungry();
        } else if (this.clock === this.dieTime) {
            this.die();
        } else if (this.clock === this.timeToStartCelebrating) {
            this.startCelebrating();
        } else if (this.clock === this.timeToEndCelebrating) {
            this.endCelebrating();
        } else if (this.clock === this.poopTime) {
            this.poop();
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
        //modFox("idling");
        this.scene = Math.random() > RAIN_CHANCE ? 0 : 1;
        modScene(SCENES[this.scene]); //set the day/rain scene
        this.sleepTime = this.clock + DAY_LENGTH; //set the timer when it's going to go back to sleep
        this.hungryTime = getNextHungerTime(this.clock);
        this.determineFoxState();
    },
    sleep() {
        this.state = "SLEEP";
        modFox("sleep");
        modScene("night");
        this.wakeTime = this.clock + NIGHT_LENGTH;
    },
    // reset time, when fox dies/goes to sleep 
    clearTimes() {
        this.wakeTime = -1;
        this.sleepTime = -1;
        this.hungryTime = -1;
        this.dieTime = -1;
        this.poopTime = -1;
        this.timeToStartCelebrating = -1;
        this.timeToEndCelebrating = -1;
    },
    getHungry() {
        this.current = "HUNGRY";
        this.dieTime = getNextDieTime(this.clock);
        this.hungryTime = -1;
        modFox("hungry");
    },
    poop() {
        this.current = "POOPING";
        this.poopTime = -1;
        this.dieTime = getNextDieTime(this.clock);
        modFox("pooping");
    },
    die() {
        this.current = "DEAD";
        modScene("dead");
        modFox("dead");
        this.clearTimes();
        writeModal("The fox died :( <br/> Press the middle button to start");
    },
    startCelebrating() {
        this.current = "CELEBRATING";
        modFox("celebrate");
        this.timeToStartCelebrating = -1;
        this.timeToEndCelebrating = this.clock + 2;
    },
    endCelebrating() {
        this.timeToEndCelebrating = -1;
        this.current = "IDLING";
        this.determineFoxState();
        togglePoopBag(false);
    },
    // when raining turn back, if idle/daytime look at camera
    determineFoxState() {
        if (this.current === "IDLING") {
            if (SCENES[this.scene] === "rain") {
                modFox("rain");
            } else {
                modFox("idling");
            }
        }
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
        this.scene = this.scene + 1 % SCENES.length;
        modScene(SCENES[this.scene]);
    },
    cleanUpPoop() {
        if (!this.current === "POOPING") {
            return;
        }
        this.dieTime = -1;
        togglePoopBag(true);
        this.startCelebrating();
        this.hungryTime = getNextHungerTime(this.clock);
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
