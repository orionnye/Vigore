import Unit from './Unit';
import { Vector } from './math';
import { fillCircle, drawImage, strokeRect,
    fillRect, fillRectCenter, drawText } from './render';
import Input from './input';
import Card from './Card';
import UI from './UI';

//-------Page Access-------
let canvas = <HTMLCanvasElement> document.getElementById("canvas1");
let c = canvas.getContext('2d');
let canvasSize = new Vector(canvas.clientWidth, canvas.clientHeight);

//-------Player Input----------
let input = new Input();
input.watchCursor();
input.watchMouse();
input.watchKeys();
window.addEventListener("keyup", (e) => {
    // console.log(e.key);
    if (e.key == "Enter") {
        console.log("Card Cycle!");
        player.endTurn(500);
    }
});

//-------World Data----------
let player = new Unit();
player.pos = new Vector(300, 100);

//temp Card Data storage
player.hand.getRandomCards(5);
player.hand.pos = new Vector(260, 440);
player.hand.offset = new Vector(90, 0);

player.draw.getRandomCards(10);
player.draw.pos = new Vector(40, 440);
player.draw.offset = new Vector(2, 2);

player.discard.getRandomCards(1);
player.discard.pos = new Vector(850, 440);
player.discard.offset = new Vector(2, 2);

let enemy = new Unit();
enemy.pos = new Vector(500, 100);

//-------CORE GAME LOOP
function update() {
    player.hand.update()
    player.draw.update()
    player.discard.update()
}

function render() {
    //clear canvas
    fillRect(new Vector(0, 0), canvasSize, "beige");

    //players
    fillRect(player.pos, player.dim, "red");
    fillRect(enemy.pos, enemy.dim, "blue");

    //deck
    player.draw.render()
    player.hand.render()
    player.discard.render()
}
function reload() {
    update();
    render();
    window.setTimeout(reload, 50);
}
reload();