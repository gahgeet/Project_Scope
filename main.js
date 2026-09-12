import * as Happy from "./happy.js"
import * as Init from "./init.js"
import * as Shape from "./shape.js"

let box = new Shape.Rectangle();
Happy.CreateSprite(
    "./images/spritesheet.png",
    {x:100,y:100},{x:4,y:4},16,10,0.1
);

Happy.CreateButton({
    name:"sheet",amount:{idle:16,hover:16,down:16},
    position:{x:100,y:300},division:{x:4,y:4},
    scale:0.1,
    callback:function(){
        window.location.href = "page.html"
    }
});
Happy.CreateButton({
    name:"sheet",amount:{idle:16,hover:16,down:16},
    position:{x:200,y:300},division:{x:4,y:4},
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
    
    Happy.ClearBackground();
    Happy.DrawRectangle("rgb(0,0,255)",box);
    Init.context.fillText("hello world!",box.x, 300, 500);


    //Happy.RunButton(button);
    Happy.RunElements();

    Init.state.mouseRelease = false;
}

Happy.HandleEvents();
Main();

