import { randomFloor, Vector } from "./math";

export let canvas = <HTMLCanvasElement> document.getElementById("canvas1");
let canvasSize = new Vector(canvas.clientWidth, canvas.clientHeight);
let c = canvas.getContext('2d');

export function fillRect(pos: Vector, size: Vector, color: string = "red") {
    c.fillStyle = color;
    c.fillRect(pos.x, pos.y, size.x, size.y);
}
export function fillRectCenter(pos: Vector, size: Vector, color: string = "red") {
    let half = size.scale(0.5);
    c.fillStyle = color;
    c.fillRect(pos.x-half.x, pos.y-half.y, size.x, size.y);
}

export function strokeRect(pos: Vector, size: Vector, color: string = "black") {
    c.strokeStyle = color;
    c.strokeRect(pos.x, pos.y, size.x, size.y);
}

//Character Definition
export function fillCircle(pos: Vector, radius: number, color: string = "black") {
    c.beginPath();
    c.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
    c.strokeStyle = color;
    c.stroke();
    c.fillStyle = color;
    c.fill();
}
export function scatterCircles(count: number, pos: Vector, range: Vector, size: number, color: string) {
    let bubbleCount = randomFloor(count) + count;
    for (let i = 0; i < bubbleCount; i++) {
        let x = randomFloor(range.x);
        let y = randomFloor(range.y);
        fillCircle(pos.add(new Vector(x, y)), size, color);
    }
}


//Text
export function drawText(pos: Vector, size: number, text: string, color: string = "black") {
    c.fillStyle = color;
    c.font = size + "px Times New Roman";
    c.fillText(text, pos.x + size, pos.y + size);
}
export function drawImage(imageSrc: string, location : Vector) {
    let loader: HTMLImageElement = new Image();
    loader.src = imageSrc;
    loader.onload = () => {
        c.drawImage(loader, location.x, location.y, 200, 200);
    }
}