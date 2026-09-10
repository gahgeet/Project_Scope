import * as Happy from "./happy.js"
import * as Init from "./init.js"
import * as Shape from "./shape.js"

let box = new Shape.Rectangle();
const sprite = Happy.CreateSprite(
    "./images/spritesheet.png",
    {x:100,y:100},{x:4,y:4},16,10,0.1
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

    if (Happy.MouseHover(sprite.output)){
        console.log("Hovering!");
        window.location.href = "page.html"
    }
}

window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        window.location.reload();
    }
});
Happy.HandleEvents();
Main();
