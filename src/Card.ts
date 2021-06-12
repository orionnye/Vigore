import Character from './Character';
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
        this.cost = 0;
        //!!!!!!!!!!!!!!THING WE CAN WATCH FOR!!!!!!!!!!!!!!!!!!!!
        //since there will only be one enemy at a time we can hard code the characters here
        this.onApply;
        this.color = "black";
    }
    apply(caster: Character, target: Character) {
        if (this.onApply == undefined) {
            caster.health += this.cost;
            target.health += this.cost / 2;
        } else {
            this.onApply(caster, target);
        }
    }
    render( destination : Vector ) {
        let adjustedPos = this.pos.add(destination);
        fillRectCenter(adjustedPos, this.size.scale(this.scale), this.color);
        drawText(adjustedPos.subtract(new Vector(48, 40)), this.scale / 2, this.cost.toString(), "white");
    }
}