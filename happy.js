import * as Init from "./init.js"

export class Rectangle{
    x = 0;
    y = 0;
    w = 100;
    h = 100;
};

export class Vector2{
    x = 0;
    y = 0;
}

export class Sprite{
    image = new Image();
    source = new Rectangle();
    position = new Vector2();
    size = new Vector2();
    current = new Vector2();
    division = new Vector2();
    exposure = 0;
    amount = 0;
    counter = 0;
}


export function HandleEvents(){
    window.addEventListener("resize",ResizeCanvas);
}

export function ClearBackground(){
    Init.context.clearRect(
        0,0,Init.canvas.width,Init.canvas.height
    );
}
/**
 * @param {string} color - The fill color (e.g., 'red', '#fff')
 * @param {Rectangle} rectangle - The rectangle data to draw
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
 * @param {Vector2} position 
 * @param {Vector2} division 
 * @param {number} amount 
 * @param {number} exposure 
 * @param {number} scale 
 * @returns 
 */
export function CreateSprite(path,position,division,amount,exposure,scale){
    const sprite = new Sprite();
    sprite.image.src = path;
    sprite.source.x = position.x;
    sprite.source.y = position.y;
    sprite.source.w = sprite.image.naturalWidth/division.x;
    sprite.source.h = sprite.image.naturalHeight/division.y;
    sprite.position.x = 0;
    sprite.position.y = 0;
    sprite.size.x = sprite.source.w*scale;
    sprite.size.y = sprite.source.h*scale;
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
        sprite.position.x,sprite.position.y,sprite.size.x,sprite.size.y
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
