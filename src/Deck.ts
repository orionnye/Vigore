import { randomFloor, Vector } from "./math";
import Card from "./Card";

export default class Deck {
    pos: Vector;
    offset: Vector;
    cards: Card[];
    cardSize: Vector;
    max: number;
    constructor(pos = new Vector(0, 0), offset = new Vector(100, 100), cards = []) {
        this.pos = pos;
        this.offset = offset;
        this.cards = cards;
        this.cardSize = new Vector(45, 60);
        this.max = 50;
    }
    get length() {
        return this.cards.length;
    }
    getRandomCards(count: number) {
        for (let i = 0; i < count; i++) {
            let card = new Card();
            this.addCard(card);
        }
    }
    addCard(card) {
        if (this.cards.length < this.max)
            this.cards.push(card);
    }
    addCards(cards) {
        cards.forEach(card => {
            this.addCard(card);
        });
    }
    removeCards(desired) {
        let count = desired > this.length ? this.length : desired;
        let cards = [];
        for (let i = 0; i < count; i++) {
            cards.push(this.cards.pop());
        }
        return cards;
    }
    emptyInto(deck: Deck) {
        if (this.length > 0) {
            deck.addCards(this.removeCards(this.length));
        } else {
            console.log()
        }
    }
    fillFrom(deck: Deck) {
        let {max, length} = this;
        if (length < max) {
            console.log("Filling Hand");
            let drawTotal = length == max ? max : max - length;
            this.addCards(deck.removeCards(drawTotal));
        } else {
            console.log("already full")
        }
    }
    contains(point) {
        let size = this.offset.scale(this.cards.length - 1).add(this.cardSize);
        let far = this.pos.add(size);
        if (point.x > this.pos.x && point.x < far.x) {
            if (point.y > this.pos.y && point.y < far.y) {
                return true;
            }
            return false;
        }
        return false;
    }
    update() {
        //assign contained cards to the proper
        if (this.cards.length > 0) {
            this.cards.forEach((card, index) => {
                let desiredPos = this.pos.add(this.offset.scale(index));
                card.seek(desiredPos);
                // card.size = this.cardSize;
            });
        }
    }
    render() {
        this.cards.forEach((card, index) => {
            // card.pos = this.pos.add(this.offset.scale(index));
            card.render();
        });
    }
}
