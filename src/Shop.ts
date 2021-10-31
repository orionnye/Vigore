import Card from "./Card";
import CardEffects from "./CardEffects";
import Deck from "./Deck";
import { randomFloor, Vector } from "./math";
import { canvas, drawText, fillRect } from "./render";

export default class Shop {
    inventory: Deck;
    inventoryMax: number;
    costs: number[];
    constructor(inventory: Deck = new Deck()) {
        this.inventory = inventory;
        this.costs = [];
        this.inventoryMax = 5;
    }
    restock() {
        this.inventory.cards = [
            new Card(CardEffects.Triage),
            new Card(CardEffects.Strike),
            new Card(CardEffects.Syphon),
            new Card(CardEffects.Tearstone),
            new Card(CardEffects.FleshWound)
        ];
        this.generateCosts();
    }
    generateCosts() {
        this.costs = [];
        for (let i = 0; i < this.inventory.length; i++) {
            // let cost = randomFloor(5) + 2;
            let cost = i;
            this.costs.push(cost);
        }
    }
    update() {
        this.inventory.cards.forEach((card, index) => {
            let start = new Vector(350, 300);
            let offset = new Vector(100*index, 0);
            card.pos = start.add(offset);
            card.angle = 0;
            card.offset = new Vector(0, 0);
        });
    }
    render() {
        this.inventory.cards.forEach((card, index) => {
            card.render(true);
        });
        this.costs.forEach((cost, index) => {
            //cost Display
            drawText(this.inventory.cards[index].pos.add(new Vector(0, 100)), 25, cost.toString(), "red");
        })
        fillRect(new Vector(320, 10), new Vector(230, 90), "rgba(0, 0, 0)");
        // drawText(new Vector(259, 3), 76, "SHOP", "rgba(0, 0, 250)");
        // drawText(new Vector(265, 5), 76, "SHOP", "rgba(0, 0, 50)");
        drawText(new Vector(265, 5), 75, "SHOP", "rgba(0, 0, 100)");
        // drawText(new Vector(320, 50), 50, "Women Be Shopping", "black");
        fillRect(new Vector(500, 500), new Vector(400, 100), "rgba(200, 200, 200)");
        drawText(new Vector(500, 530), 25, "Press 'Enter' to begin next fight", "rgba(0, 0, 100)");
    }
}