import * as Happy from "./happy.js"
import * as Init from "./init.js"
import * as Shape from "./shape.js"

let box = new Shape.Rectangle();
const sprite = Happy.CreateSpritePro(
    "./images/spritesheet.png",
    {x:0,y:0},{x:4,y:4},16,10,0.5
);


let frames = 0;
function Main(){
    if (!Happy.RunFPS(60,Main))return;
    frames ++;
    box.x += 1;
    sprite.output.x ++;
    Happy.LoopSprite(sprite);
    Happy.ClearBackground();
    Happy.DrawRectangle("rgb(0,0,255)",box);
    Happy.DrawSprite(sprite);
    Init.context.fillText("hello world!",box.x, 300, 500);
}


//Happy.HandleEvents();
Main();
