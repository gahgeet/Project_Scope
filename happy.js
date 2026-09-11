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

    /**
     * @type {Button | null}
     */
    next = null;
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
export function CreateButton(idleSrc,amountIdle,hoverSrc,amountHover,downSrc,amountDown,position,division,exposure,scale,callback = function(){}){
    const button = new Button();
    button.idleSprite = CreateSprite(idleSrc,position,division,amountIdle,exposure,scale);
    button.hoverSprite = CreateSprite(hoverSrc,position,division,amountHover,exposure,scale);
    button.downSprite = CreateSprite(downSrc,position,division,amountDown,exposure,scale);
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
 * @returns 
 */
export function CreateSprite(path,position,division,amount,exposure,scale){
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
export function AnimateSprite(sprite){
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
export function ButtonRun(button){
    AreaClicked(button.idleSprite.output);
    if(!MouseHover(button.idleSprite.output)){
        AnimateSprite(button.idleSprite);
        DrawSprite(button.idleSprite);
    }else{
        if(Init.state.mouseDown){
            AnimateSprite(button.downSprite);
            DrawSprite(button.downSprite);
        }else{
            AnimateSprite(button.hoverSprite);
            DrawSprite(button.hoverSprite);
        }
    }
    console.log("animating button!");
}