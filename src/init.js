import game, { handleUserAction } from "./gameState";
import { TICK_RATE } from "./constants";
import initButtons from "./buttons";

// we removed this tick() function, bcs we have implemented in gameState.js
// function tick() {
//     console.log("tick", Date.now());
// } 

async function init() {
    console.log("starting game");
    initButtons(handleUserAction);

    // Function inside of function = closure, persisted time over async fn call
    let nextTimeToTick = Date.now();

    function nextAnimationFrame() {
        const now = Date.now();

        if (nextTimeToTick <= now) {
            game.tick(); //add variable from import
            nextTimeToTick = now + TICK_RATE;
        }

        //request animation is a function in the browser for doing JS animation, 
        //really useful when browser idle then continue later, instead of set time out to drop out everything
        requestAnimationFrame(nextAnimationFrame);
    }

    requestAnimationFrame(nextAnimationFrame); //or nextAnimationFrame();
}

init();
