import { Vector } from './math';
import { fillRectCenter, strokeRect, drawText } from "./render";

export default class Card {

    size = new Vector(2/3, 1);
    scale : number;
    pos : Vector;
    cost : number;
    onApply : any;
    color : string;

    constructor() {
        this.size = new Vector(3/4, 1);
        this.scale = 100;
        this.pos = new Vector(0, 0);
        this.cost = Math.floor(Math.random()*10);
        this.onApply;
        this.color = `rgb(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255})`;
    }
    get dimensions() {
        return this.size.scale(this.scale)
    }
    contains(point: Vector) {
        let far = this.pos.add(this.size);
        if (point.x >= this.pos.x && point.x <= far.x) {
            if (point.y >= this.pos.y && point.y <= far.y) {
                return true
            }
            return false
        }
        return false
    }
    seek(point) {
        let dist = point.subtract(this.pos);
        if (point.subtract(this.pos).length > 3) {
            let fix = dist.multiply(0.3);
            this.pos = this.pos.add(fix);
        }
    }
    render() {
        fillRectCenter(this.pos, this.size.scale(this.scale), this.color);
        drawText(this.pos.subtract(new Vector(this.dimensions.x, 50)), this.scale / 2, this.cost.toString(), "white");
    }
}