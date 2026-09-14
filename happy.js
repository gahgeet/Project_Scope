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

export function GetLatestElementIndex(){
    return Init.state.elements.list.length-1;
}

/**
 * 
 * @param {*} buttonInfo 
 * @returns 
 */
export function CreateButton({
    name,
    amount={idle:1,hover:1,down:1},
    position= new Shape.Vector2(),
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
            scale,
            callback
        )
    ); //instead of returning the button, allocate it as an element onto init.state
    return GetLatestElementIndex();
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
 * @param {number} scale 
 * @param callback 
 */
export function CreateButtonPro(
    idleSrc,amountIdle,
    hoverSrc,amountHover,
    downSrc,amountDown,
    position,scale,
    callback = function(){}){
    const button = new Button();
    button.idleSprite = CreateButtonSprite(idleSrc,position,amountIdle,scale);
    button.hoverSprite = CreateButtonSprite(hoverSrc,position,amountHover,scale);
    button.downSprite = CreateButtonSprite(downSrc,position,amountDown,scale);
    console.log("button positions:")
    console.log(position.x);
    console.log(position.y);
    button.callback = callback;
    return button;
}


/**
 * 
 * @param {string} path 
 * @param {Shape.Vector2} position 
 * @param {number} amount 
 * @param {number} scale 
 * @returns 
 */
export function CreateButtonSprite(path,position,amount,scale){
    const sprite = new Sprite();
    sprite.image.src = path;
    Init.state.assetCount ++;
    sprite.image.onload = function(){
        console.log("loaded!");
        console.log(sprite.image.naturalWidth);
        console.log(sprite.image.naturalHeight)
        Init.state.assetCount --;
        sprite.source.w = sprite.image.naturalWidth/amount;
        sprite.source.h = sprite.image.naturalHeight;
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
    sprite.division.x = amount;
    sprite.division.y = 1;
    sprite.exposure = 5;
    return sprite;
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
    const vRec = VirtualizeSpace(rectangle);
    Init.context.fillRect(
        vRec.x,vRec.y,
        vRec.w,vRec.h
    );
}
/**
 * 
 * @param {string} font
 * @param {string} text 
 * @param {number} x 
 * @param {number} y 
 * @param {number} size
 * @param {number} maxWidth
 */
export function CreateText(font,text,x,y,size,maxWidth){
    const textArray = new Init.G_TextArray();
    textArray.font = font;
    textArray.list = text.split(' ');
    textArray.origin.x = x;
    textArray.origin.y = y;
    textArray.size = size;
    textArray.maxWidth = maxWidth;
    const Element = new Init.G_Element();
    Element.data = textArray;
    Element.type = Init.TYPES.TEXT;
    Init.state.elements.list.push(Element);
    //Init.state.textArray.push(textArray);
    return GetLatestElementIndex();
}



/**
 * 
 * @param {Init.G_TextArray} textArray 
 * @param {Shape.Rectangle} parent 
 */
export function DrawTextBlock(textArray,parent){
    Init.context.font = `${textArray.size}px ${textArray.font}, arial`;
    let posX = textArray.origin.x;
    let posY = textArray.origin.y;
    const height = textArray.size * 1.1;
    const space = Init.context.measureText(" ");

    for (let i = 0; i < textArray.list.length; i++){
        DrawTextPro(textArray.list[i],posX+parent.x,posY+parent.y);
        posX += Init.context.measureText(textArray.list[i]).width+space.width;
        if (posX > textArray.origin.x + textArray.maxWidth + parent.x){
            posX = textArray.origin.x;
            posY += height;
        }
    }
}

/**
 * 
 * @param {string} text 
 * @param {number} x 
 * @param {number} y 
 */
export function DrawTextPro(text,x,y){
    Init.state.inputRectangle.x = x;
    Init.state.inputRectangle.y = y;
    const vRec = VirtualizeSpace(Init.state.inputRectangle);
    Init.context.fillText(text,vRec.x,vRec.y);
}

/**
 * 
 * @param {string} fontName
 * @param {string} text 
 * @param {number} x 
 * @param {number} y 
 * @param {number} size
 */
export function DrawTextBase(fontName,text,x,y,size,){
    Init.state.inputRectangle.x = x;
    Init.state.inputRectangle.y = y;
    const vRec = VirtualizeSpace(Init.state.inputRectangle);
    Init.context.font = `${size}px ${fontName}, arial`;
    Init.context.fillText(text,vRec.x,vRec.y);
}
/**
 * 
 * @param {string} text 
 * @param {number} x 
 * @param {number} y 
 */
export function DrawTextDefault(text,x,y){
    DrawTextBase("arial",text,x,y,12);
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
    return GetLatestElementIndex();
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
 * 
 * @param {Sprite} sprite 
 * @param {Shape.Rectangle} parent 
 */
export function DrawSprite(sprite,parent){
    const vRec = VirtualizeSpace(sprite.output);
    Init.context.drawImage(
        sprite.image,
        sprite.source.x,sprite.source.y,sprite.source.w,sprite.source.h,
        vRec.x+parent.x,vRec.y+parent.y,
        vRec.w,vRec.h
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
export function VirtualizeSpace(rectangle){
    Init.state.outputRectangle.x = rectangle.x;
    Init.state.outputRectangle.y = rectangle.y + Init.state.scroll.y;
    Init.state.outputRectangle.w = rectangle.w;
    Init.state.outputRectangle.h = rectangle.h;
    return Init.state.outputRectangle;
}



/**
 * 
 * @param {Shape.Rectangle} rectangle 
 * @param {Shape.Rectangle} parent 
 * @returns 
 */
export function MouseHover(rectangle,parent){
    const vRec = VirtualizeSpace(rectangle);
    if (
        Init.state.mousePosition.x >= vRec.x+parent.x
        && Init.state.mousePosition.x <= vRec.x+vRec.w+parent.x
        && Init.state.mousePosition.y >= vRec.y+parent.y
        && Init.state.mousePosition.y <= vRec.y+vRec.h+parent.y
    ){
        return true;
    }
    return false;
}
/**
 * 
 * @param {Shape.Rectangle} rectangle 
 * @param {Shape.Rectangle} parent 
 * @returns 
 */
export function AreaClicked(rectangle,parent){
    if (MouseHover(rectangle,parent)&&Init.state.mouseRelease) return true;
    return false;
}

/**
 * 
 * @param {Button} button 
 * @param {Shape.Rectangle} parent 
 */
export function RunButton(button,parent){
    if(!MouseHover(button.idleSprite.output,parent)){
        LoopSprite(button.idleSprite);
        DrawSprite(button.idleSprite,parent);
    }else{
        if(Init.state.mouseDown){
            LoopSprite(button.downSprite);
            DrawSprite(button.downSprite,parent);
        }else{
            LoopSprite(button.hoverSprite);
            DrawSprite(button.hoverSprite,parent);
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
 * @param {Shape.Rectangle} parent 
 */
export function RunSprite(sprite,parent){
    LoopSprite(sprite);
    DrawSprite(sprite,parent);
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

/**
 * 
 * @param {Init.G_Element} element 
 */
export function GetParentRec(element){
    if(element.parent!=-1){
        const parent = Init.state.elements.list[element.parent];
        if(parent.type ===Init.TYPES.BUTTON){
            /**@type {Button} */
            return(parent.data).idleSprite.output;
        }
        else if(parent.type===Init.TYPES.SPRITE){
            /**@type {Sprite} */
            return(parent.data).output;
        }
        else if(parent.type===Init.TYPES.TEXT){
            Init.state.outputRectangle.x = (parent.data).origin.x;
            Init.state.outputRectangle.y = (parent.data).origin.y;
            return (Init.state.outputRectangle);
        }
    }
    return Init.blankParent;
}

export function RunElements(){
    //each element
    for (let i = 0; i < Init.state.elements.list.length; i++){
        //check the type
        const element = Init.state.elements.list[i];
        /**@type {Shape.Rectangle} */
        const parentRec = GetParentRec(element);
        if (Init.state.elements.list[i].type===Init.TYPES.SPRITE){
            //draw sprite
            RunSprite(element.data,parentRec);
            
        }
        else if (Init.state.elements.list[i].type===Init.TYPES.BUTTON){
            RunButton(element.data,parentRec);
        }
        else if (Init.state.elements.list[i].type===Init.TYPES.TEXT){
            DrawTextBlock(element.data,parentRec);
        }
    }

}

/**
 * 
 * @param {number} parent 
 * @param  {...number} children 
 */
export function Layout(parent, ...children){
    if (children.length < 1){
        console.log("no children present!");
        return;
    }
    Init.state.elements.list[children[0]].parent = parent;

    for (let i = 1; i < children.length;i++){
        Init.state.elements.list[children[i]].parent = children[i-1];
    }
}
