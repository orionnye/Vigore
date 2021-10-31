import Deck from "./Deck";
import { Vector } from "./math";
import { fillRect, strokeRect, drawText } from "./render";
 
export default class Unit {
    pos : Vector;
    offset : Vector;
    dim : Vector;
    color: string = "grey";
    pulse: number;
    
    health : number;
    maxHealth : number;

    draw : Deck;
    hand : Deck;
    discard : Deck;

    constructor() {
        this.dim = new Vector(150, 150);
        this.pos = new Vector(0, 0);
        this.offset = new Vector(0, 0);

        //stats
        this.maxHealth = 7;
        this.health = this.maxHealth;
        
        //card stats test
        this.hand = new Deck(new Vector(300, 430), new Vector(70, 0));
        this.hand.max = 5;
        this.draw = new Deck(new Vector(10, 470), new Vector(1, 1));
        this.discard = new Deck(new Vector(800, 470), new Vector(2, 1));
    }
    get active() {
        if (this.draw.active)
            return true
        if (this.hand.active)
            return true
        if (this.discard.active)
            return true
        return false
    }
    update() {
        //cleans the card pile
        this.draw.cards.forEach(card => {
            card.align(0.75);
        });

        //decay the offset
        this.offset = this.offset.scale(0.5);
        this.hand.update();
        this.draw.update();
        this.discard.update();
    }
    cleanHealth() {
        if ( this.health >= this.maxHealth ) {
            this.health -= this.health - this.maxHealth;
        }
    }
    contains(point: Vector) {
        let near = this.pos.add(this.offset);
        let far = near.add(this.dim);
        if (point.x >= near.x && point.x <= far.x) {
            if (point.y >= near.y && point.y <= far.y) {
                return true
            }
            return false
        }
        return false
    }
    endTurn(delay: number) {
        let { draw, hand, discard } = this;
        //empty Hand
        hand.randomlyEmptyInto(discard);
        window.setTimeout(() => {
        hand.fillFrom(draw);
            window.setTimeout(() => {
                if (draw.length == 0) {
                    discard.randomlyEmptyInto(draw);
                    window.setTimeout(() => {
                        hand.fillFrom(draw);
                    }, delay)
                }
            }, delay)
        }, delay)
    }

    render() {
        let { offset } = this;
        let adjustedPos = this.pos.add(new Vector(Math.sin(offset.x)*5, Math.sin(offset.y)*5));

        //this
        fillRect(adjustedPos, this.dim, this.color);
        strokeRect(adjustedPos, this.dim, "black");

        //this Health Bar
        let textScale = 40;
        let healthPos = adjustedPos.add(new Vector(0, this.dim.y));
        drawText(healthPos, textScale, this.health.toString() + "/", "rgb(255, 0, 0)");
        drawText(healthPos.add(new Vector(textScale+10, 0)), textScale + 5, this.maxHealth.toString(), "rgb(180, 0, 0)");
        //should be rendering MP and HP as different colors
    }
}