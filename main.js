import * as Happy from "./happy.js"
import * as Init from "./init.js"
import * as Shape from "./shape.js"

let box = new Shape.Rectangle();
/*
Happy.CreateSprite(
    "./images/spritesheet.png",
    {x:100,y:100},{x:4,y:4},16,10,0.1
);

Happy.CreateButton(
    "sheet",{idle:4,hover:4,down:4},
    {x:100,y:300},0.1,function(){
        window.location.href = "page.html"
    }
);
Happy.CreateButton(
    "sheet",{idle:4,hover:4,down:4},
    {x:200,y:300},0.1,function(){
        window.location.href = "page.html"
    }
);*/

//create returns element index?
//parent element contains array of indexes
//createparent(parent,...children){children[0].parent = parent; for i=1; i<children.length; i++{children[i].parent = children[i-1]}  return index.}
//

Happy.Layout(
    Happy.CreateSprite(
        "./images/spritesheet.png",
        {x:100,y:100},{x:4,y:4},16,10,0.1
    ),Happy.CreateButton("sheet",{idle:4,hover:4,down:4},
        {x:10,y:10},0.1,function(){
            window.location.href = "page.html"
        }
    ),Happy.CreateButton("sheet",{idle:4,hover:4,down:4},
        {x:50,y:0},0.1,function(){
            window.location.href = "page.html"
        }
    )
    
    //need a more condensed function for appending children
)


Happy.CreateText("Super Bouncer","hello emily emily oo la la test check texting",500,300,30,200);
 
let frames = 0;
function Main(){
    if (!Happy.RunFPS(60,Main))return;
    frames ++;
    box.x += 1;
    //Init.state.scroll.y -= 1;
    Happy.ClearBackground();
    Happy.DrawRectangle("rgb(0,0,255)",box);
    //Init.context.fillText("hello world!",box.x, 300, 500);
    Happy.DrawTextDefault("hello world!",box.x,300);
    Happy.DrawTextBase("Emily Street","EMILY STREETz",300,500,40);
    Happy.DrawTextBase("Super Bouncer","SUPER bouncED",600,800,40);

    //Happy.RunButton(button);
    Happy.RunElements();

    Init.state.mouseRelease = false;
}

Init.LoadFont("Emily Street");
Init.LoadFont("Super Bouncer");
Happy.HandleEvents();
Main();

//disable scrolling: COMPLETE!
//text drawing investigation:
////font loading. COMPLETE!

////how do I handle multiple fonts? COMPLETE!

////download a ttf and load them... COMPLETE!

////text wrapping... COMPLETE!
////-declare text to be drawn... check!
////-split it into parts to wrap...check!
////-this means I need an array in the init state for strings... check!
////-make a text Array class for this...Check!
////-within the loop draw the text that is presplit for me... check!

//mutating text positions? medium priority...
////-have CreateText()return an index number...
////-grab the index number to mutate it?  or maybe have parent property?
//implement text drawing within the element drawing procedure? COMPLETE!
//animating the text? low priority...