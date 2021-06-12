import { Vector } from "./math";
import { fillRect, strokeRect, drawText } from "./render";
 
export default class Character {
    health : number;
    maxHealth : number;
    pos : Vector;
    dim : Vector;
    color: String;

    constructor() {
        this.maxHealth = 20;
        this.health = this.maxHealth;
        this.dim = new Vector(75, 100);
        this.pos = new Vector(0, 0);
    }

    render(pos: Vector) {
        let adjustedPos = pos.add(this.pos)

        //player
        fillRect(adjustedPos, this.dim, "white");
        strokeRect(adjustedPos, this.dim, "black");

        //player Health Bar
        let healthPos = adjustedPos.add(new Vector(-this.dim.x/4, this.dim.y));
        let healthDisplay = this.health.toString() + "/" + this.maxHealth.toString();
        drawText(healthPos, 25, healthDisplay, "red");
    }
}