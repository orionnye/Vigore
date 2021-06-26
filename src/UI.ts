import Card from "./Card";
import Character from "./Unit";
import { Vector } from "./math";

export default class UI {
    popUp: number;
    scaleCap: number;
    scaleMin: number;
    popUpMax: number;
    unitIndex: number;
    cardIndex: number;
    handPos = new Vector(300, 460);
    constructor() {
        this.popUp = 0;
        this.scaleCap = 120;
        this.scaleMin = 100;
        this.popUpMax = 30;
    }
    update(unit: Character) {
        unit.draw.cards.forEach( (card, index) => {
            card.seek(this.handPos.add(new Vector( index*100, -this.popUp)));
        });
        unit.hand.cards.forEach( (card, index) => {
            card.seek(this.handPos.add(new Vector( index*100, -this.popUp)));
        });
        unit.discard.cards.forEach( (card, index) => {
            card.seek(this.handPos.add(new Vector( index*100, -this.popUp)));
        });
    }
}