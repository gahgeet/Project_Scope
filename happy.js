import * as Init from "./init.js"
import * as Shape from "./shape.js"



export class Sprite{
    image = new Image();
    source = new Shape.Rectangle();
    output = new Shape.Rectangle();
    current = new Shape.Vector2();
    division = new Shape.Vector2();
    exposure = 0;
    amount = 0;
    counter = 0;
};

export class Button{
    idleSprite = new Sprite();
    hoverSprite = new Sprite();
    downSprite = new Sprite();
    callback = function(){};
}


export class ButtonSpriteAmount{
    idle = 0;
    hover = 0;
    down = 0;
}


/**
 * 
 * @param {*} buttonInfo 
 * @returns 
 */
export function CreateButton({
    name,
    amount={idle:1,hover:1,down:1},
    position,
    division,
    exposure=10,
    scale=1.0,
    callback=function(){}
} = ({})) {
    AddElement(
        Init.TYPES.BUTTON,
        CreateButtonPro(//slow
            `./images/${name}_idle.png`,amount.idle,
            `./images/${name}_hover.png`,amount.hover,
            `./images/${name}_down.png`,amount.down,
            position,
            division,//might just load all of them as horizontal sheets
            exposure,
            scale,
            callback
        )
    ); //instead of returning the button, allocate it as an element onto init.state
}
/**
 * 
 * @param {string} idleSrc 
 * @param {number} amountIdle 
 * @param {string} hoverSrc 
 * @param {number} amountHover 
 * @param {string} downSrc 
 * @param {number} amountDown 
 * @param {Shape.Vector2} position 
 * @param {Shape.Vector2} division 
 * @param {number} exposure 
 * @param {number} scale 
 * @param callback 
 */
export function CreateButtonPro(
    idleSrc,amountIdle,
    hoverSrc,amountHover,
    downSrc,amountDown,
    position,division,exposure,scale,
    callback = function(){}){
    const button = new Button();
    button.idleSprite = CreateSpritePro(idleSrc,position,division,amountIdle,exposure,scale);
    button.hoverSprite = CreateSpritePro(hoverSrc,position,division,amountHover,exposure,scale);
    button.downSprite = CreateSpritePro(downSrc,position,division,amountDown,exposure,scale);
    console.log("button positions:")
    console.log(position.x);
    console.log(position.y);
    button.callback = callback;
    return button;
}

export function HandleEvents(){
    window.addEventListener("resize",ResizeCanvas);
    window.addEventListener("mousemove",function(e){
        Init.state.mousePosition.x = e.offsetX;
        Init.state.mousePosition.y = e.offsetY;
    });
    window.addEventListener("pageshow",function(e){
        if (e.persisted) {
            window.location.reload();
        }
    });
    window.addEventListener("mouseup",function(){
        Init.state.mouseRelease = true;
        Init.state.mouseDown = false;
    });
    window.addEventListener("mousedown",function(){
        Init.state.mouseDown = true;
    });

}

export function ClearBackground(){
    Init.context.clearRect(
        0,0,Init.canvas.width,Init.canvas.height
    );
}
/**
 * @param {string} color - The fill color (e.g., 'red', '#fff')
 * @param {Shape.Rectangle} rectangle - The rectangle data to draw
 */
export function DrawRectangle(color,rectangle){
    Init.context.fillStyle = color;
    Init.context.fillRect(
        rectangle.x,rectangle.y,rectangle.w,rectangle.h
    );
}
/**
 * 
 * @param {string} path 
 * @param {Shape.Vector2} position 
 * @param {Shape.Vector2} division 
 * @param {number} amount 
 * @param {number} exposure 
 * @param {number} scale 
 */
export function CreateSprite(path,position,division,amount,exposure,scale){
    AddElement(Init.TYPES.SPRITE,CreateSpritePro(path,position,division,amount,exposure,scale));
}
/**
 * 
 * @param {string} path 
 * @param {Shape.Vector2} position 
 * @param {Shape.Vector2} division 
 * @param {number} amount 
 * @param {number} exposure 
 * @param {number} scale 
 * @returns 
 */
export function CreateSpritePro(path,position,division,amount,exposure,scale){
    const sprite = new Sprite();
    sprite.image.src = path;
    Init.state.assetCount ++;
    sprite.image.onload = function(){
        console.log("loaded!");
        console.log(sprite.image.naturalWidth);
        console.log(sprite.image.naturalHeight)
        Init.state.assetCount --;
        sprite.source.w = sprite.image.naturalWidth/division.x;
        sprite.source.h = sprite.image.naturalHeight/division.y;
        sprite.output.w = sprite.source.w*scale;
        sprite.output.h = sprite.source.h*scale;
    }
    sprite.source.x = 0;
    sprite.source.y = 0;
    
    sprite.output.x = position.x;
    sprite.output.y = position.y;
    
    sprite.current.x = 0;
    sprite.current.y = 0;
    sprite.amount = amount;
    sprite.counter = 0;
    sprite.division = division;
    sprite.exposure = exposure;
    return sprite;
}
/**
 * @param {Sprite} sprite 
 */
export function DrawSprite(sprite){
    Init.context.drawImage(
        sprite.image,
        sprite.source.x,sprite.source.y,sprite.source.w,sprite.source.h,
        sprite.output.x,sprite.output.y,sprite.output.w,sprite.output.h
    );
}
/**
 * 
 * @param {Sprite} sprite 
 */
export function LoopSprite(sprite){
    sprite.source.x = sprite.current.x * sprite.source.w;
    sprite.source.y = sprite.current.y * sprite.source.h;
    sprite.counter ++;
    if (sprite.counter % sprite.exposure == 0){
        sprite.current.x += 1;
    }
    
    if (sprite.current.x * sprite.source.w>=sprite.image.naturalWidth){
        sprite.current.x = 0;
        sprite.current.y += 1;
        if (sprite.current.y*sprite.source.h >= sprite.image.naturalHeight){
            sprite.current.y = 0;
        }
    }
    if ((sprite.current.y*sprite.division.x) + sprite.current.x > sprite.amount-1){
        sprite.current.x = 0;
        sprite.current.y = 0;
    }
    //console.log(sprite.current.y*sprite.division.x + sprite.current.x);
}

/**
 * 
 * @param {number} fps 
 * @param {FrameRequestCallback} callback 
 * @returns 
 */
export function RunFPS(fps,callback){
    requestAnimationFrame(callback);
    if (Init.state.assetCount)return false;

    const deltaTime = performance.now() - Init.state.lastTime;
    const targetDuration = 1000/fps;
    if (deltaTime <= targetDuration)return false;

    const excessTime = deltaTime%targetDuration;
    Init.state.lastTime = performance.now()-excessTime;
    return true;
}

export function ResizeCanvas(){
    Init.canvas.width = window.innerWidth;
    Init.canvas.height = window.innerHeight;
}
/**
 * 
 * @param {Shape.Rectangle} rectangle 
 * @returns 
 */
export function MouseHover(rectangle){
    if (
        Init.state.mousePosition.x >= rectangle.x
        && Init.state.mousePosition.x <= rectangle.x+rectangle.w
        && Init.state.mousePosition.y >= rectangle.y
        && Init.state.mousePosition.y <= rectangle.y+rectangle.h
    ){
        return true;
    }
    return false;
}
/**
 * 
 * @param {Shape.Rectangle} rectangle 
 */
export function AreaClicked(rectangle){
    if (MouseHover(rectangle)&&Init.state.mouseRelease) return true;
    return false;
}
/**
 * 
 * @param {Button} button 
 */
export function RunButton(button){
    if(!MouseHover(button.idleSprite.output)){
        LoopSprite(button.idleSprite);
        DrawSprite(button.idleSprite);
    }else{
        if(Init.state.mouseDown){
            LoopSprite(button.downSprite);
            DrawSprite(button.downSprite);
        }else{
            LoopSprite(button.hoverSprite);
            DrawSprite(button.hoverSprite);
        }

        if(Init.state.mouseRelease){
            button.callback();
        }
    }
    //console.log("animating button!");
}
/**
 * 
 * @param {Sprite} sprite 
 */
export function RunSprite(sprite){
    LoopSprite(sprite);
    DrawSprite(sprite);
}

/**
 * 
 * @param {Init.G_ElementArray} array 
 * @param {any} data 
 * @param {number} type 
 * @returns 
 */
export function AppendElement(array,type,data){
    array.list.push(new Init.G_Element());
    array.list[array.list.length-1].data = data;
    array.list[array.list.length-1].type = type;
    return array.list;
}

/**
 * 
 * @param {number} type 
 * @param {any} data 
 */
export function AddElement(type,data){
    AppendElement(Init.state.elements,type,data);
}

export function RunElements(){
    //each element
    for (let i = 0; i < Init.state.elements.list.length; i++){
        //check the type
        if (Init.state.elements.list[i].type===Init.TYPES.SPRITE){
            //draw sprite
            RunSprite(Init.state.elements.list[i].data);
        }
        else if (Init.state.elements.list[i].type===Init.TYPES.BUTTON){
            RunButton(Init.state.elements.list[i].data);
        }
    }
}