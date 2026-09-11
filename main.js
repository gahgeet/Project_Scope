import * as Happy from "./happy.js"
import * as Init from "./init.js"
import * as Shape from "./shape.js"

let box = new Shape.Rectangle();
const sprite = Happy.CreateSprite(
    "./images/spritesheet.png",
    {x:100,y:100},{x:4,y:4},16,10,0.1
);

const button = Happy.CreateButton({
    name:"sheet",amount:{idle:16,hover:16,down:16},
    position:{x:100,y:300},division:{x:4,y:4},
    scale:0.1,
    callback:function(){
        window.location.href = "page.html"
    }
});

let frames = 0;
function Main(){
    if (!Happy.RunFPS(60,Main))return;
    frames ++;
    box.x += 1;
    
    Happy.LoopSprite(sprite);
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


//createbutton->button gets added to default space, increments position,
//if space gets added,create space at current y position,
//if create button-> add button to latest space, increment position.
//if button exists previously, create new button at current x position,
//should i create a type agnostic way of handling elements?