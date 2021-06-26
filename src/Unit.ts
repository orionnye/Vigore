import Deck from "./Deck";
import { Vector } from "./math";
import { fillRect, strokeRect, drawText } from "./render";
 
export default class Unit {
    pos : Vector;
    dim : Vector;
    color: String;
    
    health : number;
    maxHealth : number;

    draw : Deck;
    hand : Deck;
    discard : Deck;

    constructor() {
        this.dim = new Vector(75, 100);
        this.pos = new Vector(0, 0);

        //stats
        this.maxHealth = 20;
        this.health = this.maxHealth;
        
        //card stats test
        this.hand = new Deck(new Vector(300, 430), new Vector(70, 0));
        this.hand.max = 5;
        this.draw = new Deck(new Vector(10, 470), new Vector(1, 1));
        this.discard = new Deck(new Vector(800, 470), new Vector(2, 1));
    }
    endTurn(delay: number) {
        let { draw, hand, discard } = this;
        //empty Hand
        hand.emptyInto(discard)
        window.setTimeout(() => {
        hand.fillFrom(draw);
            window.setTimeout(() => {
                if (draw.length == 0) {
                    draw.fillFrom(discard);
                    window.setTimeout(() => {
                        hand.fillFrom(draw);
                    }, delay)
                }
            }, delay)
        }, delay)
    }

    render(pos: Vector) {
        let adjustedPos = pos.add(this.pos)

        //this
        fillRect(adjustedPos, this.dim, "white");
        strokeRect(adjustedPos, this.dim, "black");

        //this Health Bar
        let healthPos = adjustedPos.add(new Vector(-this.dim.x/4, this.dim.y));
        let healthDisplay = this.health.toString() + "/" + this.maxHealth.toString();
        drawText(healthPos, 25, healthDisplay, "red");
    }
}