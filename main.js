import * as Happy from "./happy.js"
import * as Init from "./init.js"
import * as Shape from "./shape.js"

let box = new Shape.Rectangle();
const sprite = Happy.CreateSprite(
    "./images/spritesheet.png",
    {x:100,y:100},{x:4,y:4},16,10,0.1
);

//create sprite idle
//create sprite hover
//create sprite down
//create button

const button = Happy.CreateButton(
    "./images/sheet_idle.png",16,
    "./images/sheet_hover.png",16,
    "./images/sheet_down.png",16,
    {x:200,y:200},{x:4,y:4},10,0.1
);

let frames = 0;
function Main(){
    if (!Happy.RunFPS(60,Main))return;
    frames ++;
    box.x += 1;
    
    Happy.AnimateSprite(sprite);
    Happy.ClearBackground();
    Happy.DrawRectangle("rgb(0,0,255)",box);
    Happy.DrawSprite(sprite);
    Init.context.fillText("hello world!",box.x, 300, 500);

    if (Happy.AreaClicked(sprite.output)){
        window.location.href = "page.html"
    }

    Happy.ButtonRun(button);

    Init.state.mouseRelease = false;
}

Happy.HandleEvents();
Main();
