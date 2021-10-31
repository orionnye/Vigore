import { randomFloor, Vector } from "./math";
import Card from "./Card";
import { canvas, drawText, fillRect, strokeRect } from "./render";
import Effect from "./Effects";
import CardEffects from "./CardEffects";

export default class Deck {
    pos: Vector;
    offset: Vector;
    cards: Card[];
    cardSize: Vector;
    max: number;
    constructor(pos = new Vector(0, 0), offset = new Vector(10, 10), cardCount : number = 0) {
        this.pos = pos;
        this.offset = offset;
        this.cards = [];
        this.max = 50;
        this.getRandomCards(cardCount);
    }
    get length() {
        return this.cards.length;
    }
    getRandomCards(count: number, effectSpread: Effect[] = [ CardEffects.Strike, CardEffects.Triage ]) {
        for (let i = 0; i < count; i++) {
            let effect = effectSpread[ Math.floor( Math.random() * effectSpread.length ) ]
            let card = new Card(effect);
            this.addCard(card);
        }
    }
    addCard(card, spin = 20) {
        if (this.cards.length < this.max) {
            card.spin(spin)
            card.newOffset(8);
            card.selected = false
            this.cards.push(card);
        }
    }
    addCards(cards) {
        cards.forEach(card => {
            this.addCard(card);
        });
    }
    addCardsatRandom(cards) {
        cards.forEach(card => {
            this.insertAtRandom(card);
        });
    }
    remove( card: Card ) {
        let index = this.cards.indexOf( card )
        this.cards.splice( index, 1 )
    }

    insertAt( card, index ) {
        if ( this.length == 0 ) {
            this.cards.push( card )
            return
        }
        let store = this.cards[ index ]
        this.cards[ index ] = card
        this.cards.push( store )
    }

    insertAtRandom( card ) {
        let random = Math.floor( Math.random() * this.length )
        this.insertAt( card, random )
    }

    transferCard( destination: Deck ) {
        let card = this.cards.pop()
        if ( card ) {
            destination.cards.push( card )
        }
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
            console.log("Deck already empty")
        }
    }
    randomlyEmptyInto(deck: Deck) {
        if (this.length > 0) {
            deck.addCardsatRandom(this.removeCards(this.length));
        } else {
            console.log("Deck already empty")
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
    get active() {
        for ( let i = 0; i < this.length; i++ ) {
            if ( this.cards[i].active ) {
                return true
            }
        }
        return false
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
                //moves the cards to desired positions
                if (!card.selected) {
                    let desiredPos = this.pos.add(this.offset.scale(index));
                    card.seek(desiredPos);
                }
                card.update();
            });
        }
    }
    render( details : boolean = true ) {
        let store
        this.cards.forEach((card, index) => {
            card.render(details);
            if (card.selected) {
                store = card
            }
        });
        //draws the selected card again so it isnt covered by other cards
        if (store)
            store.render()
    }
    renderStack() {
        if (this.length > 0) {
            this.cards.forEach( ( card, index ) => {
                card.render(false);
                if (index == this.length - 1) {
                    let { pos, offset, dimensions, bump, color, scale } = card
                    
                    let offPos = pos.add(offset.add(new Vector(0, -bump)));
                    let textSize = scale / 2.5;
                    let textPos = offPos.add(new Vector(-textSize/2, textSize/3));
                    
                    drawText(textPos, textSize+1 , this.length.toString(), "white");
                    drawText(textPos, textSize , this.length.toString(), "black");
                }
            });
    
        }
    }
}
