import * as Shape from "./shape.js"

document.title = "hello world";
const cnvs = document.createElement('canvas');
if (!cnvs){
    throw new Error("canvas was not created");
}
export const canvas = cnvs;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.backgroundColor = "rgb(255,100,150)";
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

document.body.style.overflow = "hidden";

/**
 * 
 * @param {string} name 
 */
export function LoadFont(name){
    const newFont = new FontFace(name,`url('./fonts/${name}.ttf')`);
    newFont.load().then(function(font){
        document.fonts.add(font);
        console.log("loaded font!");
    });
}

if (!ctx) {
    throw new Error("context was not created.");
}
export const context = ctx;

export const TYPES = {
    BUTTON: 0,
    SPRITE: 1,
    TEXT: 2,
};

export class G_ElementArray{
    /** @type{G_Element[]} */
    list = [];
}

export class G_Element{
    /** @type {any} */
    data = null;
    type = -1;
};

export class G_TextArray{
    font = "";
    list = new Array();
    origin = new Shape.Vector2;
    size = 0;
    maxWidth = 0;
}

class State {
    lastTime = 0;
    mousePosition = new Shape.Vector2();
    loaded = false;
    assetCount = 0;
    mouseRelease = false;
    mouseDown = false;
    scroll = new Shape.Vector2;
    inputRectangle = new Shape.Rectangle();
    outputRectangle = new Shape.Rectangle();
    elements = new G_ElementArray();
//    /** @type {G_TextArray[]} */
//    textArray = [];
};

export const state = new State();
state.lastTime = performance.now();
