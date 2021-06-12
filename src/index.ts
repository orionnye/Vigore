import Character from './Character';
import { Vector } from './math';
import { fillCircle, drawImage, strokeRect,
    fillRect, fillRectCenter, drawText } from './render';
import Input from './input';
import Card from './Card';

//-------Page Access-------
let canvas = <HTMLCanvasElement> document.getElementById("canvas1");
let c = canvas.getContext('2d');
let canvasSize = new Vector(canvas.clientWidth, canvas.clientHeight);

//-------World Data----------
let player = new Character();
let enemy = new Character();
//player Input
let input = new Input();
input.watchCursor();
input.watchKeys();

//!!!!!!!!!!!!!!!!!!TEMP DATA STORE!!!!!!!!!!!!!!!!!!!!!!
//text store data


//TEMP DECK STORE
let cards = [];
for (let i = 0; i < 4; i++) {
    let card = new Card();
    // card.cost = Math.floor(Math.random()*5);
    card.cost = i;
    cards.push(card);
}

//TEMP CARDTYPE DATA STORE
//sqrt both characters
cards[0].onApply = (player, enemy) => {
    player.health = Math.ceil(Math.sqrt(player.health));
    enemy.health = Math.ceil(Math.sqrt(enemy.health));
}
//increase max Health but cut health
cards[1].onApply = (player, enemy) => {
    player.maxHealth += 10;
    player.health -= 10;
}
//damages enemy and damages player by less
cards[2].onApply = (player, enemy) => {
    enemy.health -= 10;
    player.health -= 5;
}
//heals player
cards[3].onApply = (player, enemy) => {
    player.health += 10;
    enemy.health += 5;
}

//--hand--
let selected = cards.length;

//-------CORE GAME LOOP
function update() {
    if (input.keys.get("ArrowRight") && selected < cards.length -1) {
        selected += 1;
    } 
    else if (input.keys.get("ArrowLeft") && selected > 0) {
        selected -= 1;
    }
    if (input.keys.get("Enter")) {
        if (selected < cards.length && selected >= 0) {
            console.log(cards[selected].cost)
            cards[selected].apply(player, enemy);
        }
    }
}
function render() {
    //clear canvas
    fillRect(new Vector(0, 0), canvasSize, "beige");
    
    //player
    player.render(new Vector(250, 50));
    //enemy
    enemy.render(new Vector(550, 50));

    //deck render
    cards.forEach((card, index) => {
        //selection animation
        let popUp = 0
        let scaleCap = 120;
        let scaleMin = 100;
        let popUpMax = 30;
        if (index == selected) {
            if (card.scale < scaleCap) {
                card.scale += 5;
            }
            popUp = popUpMax
        }
        else if (card.scale > scaleMin){
            card.scale -= 5;
        }
        card.render(new Vector(300 + index*100, 460 - popUp));
    });
}
function reload() {
    update();
    render();
    window.setTimeout(reload, 50);
}
reload();