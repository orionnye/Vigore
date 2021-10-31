import Unit from './Unit';
import { randomFloor, Vector } from './math';
import { fillCircle, drawImage, strokeRect,
    fillRect, fillRectCenter, drawText, scatterCircles } from './render';
import Input from './input';
import Card from './Card';
import UI from './UI';
import Deck from './Deck';
import CardEffects from './CardEffects';
import Shop from './Shop';

//-------Page Access-------
let canvas = <HTMLCanvasElement> document.getElementById("canvas1");
let c = canvas.getContext('2d');
let canvasSize = new Vector(canvas.clientWidth, canvas.clientHeight);

//-------Player Input----------
let input = new Input();
let grabbing: Card;
let playerTurn = true;
input.watchCursor();
input.watchMouse();
input.watchKeys();
window.addEventListener("keyup", (e) => {
    if (e.key == "Enter") {
        if ( player.health < 1 ) {
            gameOver = true;
            console.log("gameOver");
        }
        if ( shopping ) {
            roundWon = true;
            playerTurn = true;
            shopping = false;
            level += 1;

            console.log("END SHOPPING ROUND TURN", shopping, level);
            console.debug();
        } else if ( gameOver ) {
            location.reload();
        } else if ( roundWon ) {
            if ( level % shopDistance == 0 ) {
                //Initiate Shop
                shopping = true;
                shop.generateCosts();
                shop.restock();
                shop.update();
                roundWon = false;
                player.hand.emptyInto(player.draw);
                player.discard.emptyInto(player.draw);
            } else {
                level += 1;
                enemy = new Unit();
                enemy.pos = new Vector(canvas.width-enemy.dim.x-100, 100);
                enemy.maxHealth += level;
                enemy.health += level;
                roundWon = false;
                playerTurn = true;

                intents = [
                    () => {},
                    () => {player.health -= startingDamage + level},
                    () => {enemy.health += startingDamage + level},
                    () => {player.health -= (enemy.health - enemy.maxHealth)}
                ];
                intentList = [
                    'Sizing you up',
                    `Inflict: -${startingDamage+level} hp`,
                    `Gain: ${startingDamage+level} hp`,
                    `Inflict: (hp - mp) hp`
                ];

                //card grab
                window.setTimeout( () => {
                    console.log("Card Cycle!");
                    //player Action
                    player.endTurn(300);
                    playerTurn = true;
                    player.cleanHealth();
                }, 1000);
            }
        }
        else if (!player.active && playerTurn) {
            
            playerTurn = false;
            enemy.cleanHealth();
            
            if ( roundWon ) {
                level += 1;
                enemy = new Unit();
                enemy.pos = new Vector(canvas.width-enemy.dim.x-100, 100);
                enemy.maxHealth += level; 
                enemy.health += level;
                roundWon = false;
                playerTurn = true;
            } 
            if ( enemy.health <= 0 && !playerTurn) {
                render();
                roundWon = true;
                console.log("roundWon");
            } else {
                window.setTimeout(() => {
                    console.log(intentIndex)
                    intents[intentIndex%intents.length]();
                    console.log(intentIndex)
                    intentIndex = (intentIndex%(intents.length - 1)) + 1;
                    console.log(intentIndex)
                    render();
                    if ( player.health < 1 ) {
                        render();
                        gameOver = true;
                        console.log("gameOver");
                    }
                }, 500);
                window.setTimeout( () => {
                    console.log("Card Cycle!");
                    //player Action
                    player.endTurn(300);
                    playerTurn = true;
                    player.cleanHealth();
                }, 1000);
            }
        }
    }
    // console.log(e.key)
});
window.addEventListener("mouseup", e => {
    // console.log(selection)
    if (e.button == 0 ) {
        if (player.contains(input.cursor) && grabbing) {
            console.log("PLAYER")
            grabbing.selected = false;
            player.discard.insertAtRandom(grabbing);
            player.hand.remove(grabbing);
            grabbing.effect.onApply(player, player);
            grabbing = undefined;
        }
        if (enemy.contains(input.cursor) && grabbing) {
            console.log("ENEMY")
            grabbing.selected = false;
            player.discard.insertAtRandom(grabbing);
            player.hand.remove(grabbing);
            grabbing.effect.onApply(player, enemy);
            grabbing = undefined;
        }
        grabbing = undefined;
    }
});

//-------World Data-----
//shop
let shop = new Shop();
shop.restock();
shop.generateCosts();
shop.update();
//player
let player = new Unit();
player.color = "rgba(150, 0, 0)";
player.pos = new Vector(100, 100);
let previousPlayerHealth = player.health;
//Game Running stats
let level = 0;
let shopDistance = 4;
let gameOver = false;
let roundWon = false;
let shopping = true;

//-!!!!)(*@&#^$!&@^#%temp Card Data storage!(*@&#$^(!@*&#$^))
let height = 380;

player.draw = new Deck(new Vector(50, height), new Vector(1, 1), 6);
player.hand = new Deck(new Vector(280, height), new Vector(100, 0), 0);
player.hand.max = 4;
player.discard = new Deck(new Vector(800, height), new Vector(0, 0), 0);

player.hand.emptyInto(player.draw);
player.discard.emptyInto(player.draw);

//enemy storage
let enemy = new Unit();
enemy.pos = new Vector(canvas.width-enemy.dim.x-100, 100);
let previousEnemyHealth = enemy.health;
//!(@*&#$^!O@*#&$^!@#&O$^*TEMPORARY ENEMY Intent STORAGE!(*@&#$^%%^&!@(#$^%)!@#&*$^)
let startingDamage = 5;
let intents = [
    () => {},
    () => {player.health -= startingDamage + level},
    () => {enemy.health += startingDamage + level},
    () => {player.health += (enemy.health - enemy.maxHealth)}
];
let intentList = [
    'Sizing you up',
    `Inflict: -${startingDamage+level} hp`,
    `Gain: ${startingDamage+level} hp`,
    `Inflict: (hp - mp) hp`
];
let intentIndex = 0;

//-------CORE GAME LOOP
function update() {
    player.update();
    enemy.update();
    // player and card updates
    if (shopping) {
        shop.inventory.cards.forEach((card, index) => {
            if ( card.contains(input.cursor) ) {
                if (input.mouse.get(0) && !grabbing) {
                    // console.log("clicked:", card);
                    player.draw.addCard(card);
                    player.health -= shop.costs[index];
                    shop.costs.splice(index, 1);
                    shop.inventory.remove(card);
                    window.setTimeout(() => {
                        shop.restock();
                        shop.update();
                    }, 500)
                }
            }
        });
        
    }
    if (!shopping) {
        
        player.hand.cards.forEach((card, index) => {
            if ( card.contains(input.cursor) ) {
                
                //cleans itself on inspection
                card.align(0.3);
                if (input.mouse.get(0) && !grabbing) {
                    console.log("clicked:", index)
                    card.selected = true;
                    //chase cursor
                    grabbing = card;
                }
            } else if (input.mouse.get(0) && card !== grabbing) {
                card.selected = false;
            }
        });
        if ( grabbing ) {;
            grabbing.pos = input.cursor.subtract(grabbing.dimensions.scale(0.5));
        }
        
        //effects
        //jiggle effects
        let jiggleStrength = 20;
        if (player.health > previousPlayerHealth)
        player.offset.y = jiggleStrength;
        if (player.health < previousPlayerHealth)
        player.offset.x = jiggleStrength;
        if (enemy.health > previousEnemyHealth)
        enemy.offset.y = jiggleStrength;
        if (enemy.health < previousEnemyHealth)
        enemy.offset.x = jiggleStrength;
    }   
}
let backgroundColor = "rgba(100, 100, 110, 0.9)";
function render() {
    //gameOver Screen
    if (gameOver) {
        fillRect(new Vector(0, 0), canvasSize, "rgba(108, 0, 0, 0.1)");
        drawText(new Vector(canvasSize.x/2 - 150, canvasSize.y/3), 50, "Game Over", "rgba(255, 0, 0, 1)");
        drawText(new Vector(canvasSize.x/2 - 175, canvasSize.y/3 + 65), 30, "Press Enter to begin again", "rgba(255, 255, 255, 0.2)");
    } else if (roundWon) {
        fillRect(new Vector(0, 0), canvasSize, "rgba(108, 0, 108, 0.1)");
        drawText(new Vector(canvasSize.x/2 - 150, canvasSize.y/3), 50, "Round Won!", "rgba(255, 0, 0, 1)");
        drawText(new Vector(canvasSize.x/2 - 220, canvasSize.y/3 + 65), 30, "Press Enter to continue your journey", "white");
    } else if ( !shopping ) {
        //clear canvas
        fillRect(new Vector(0, 0), canvasSize, backgroundColor);
        //Turn Display
        let turnText = playerTurn ? "Player Turn" : "Enemy Turn";
        drawText(new Vector(canvasSize.x/2 - 150, canvasSize.y - 65), 50, turnText, "rgba(0, 0, 0, 1)");

        //players
        //effectColors
        let damage = "rgba(0, 255, 0, 0.1)";
        let healing = "rgba(255, 0, 0, 0.1)";
        player.render();
        //effect renders!
        if (player.health > previousPlayerHealth)
            scatterCircles(20, player.pos, new Vector(150, 150), 25, damage);
        if (player.health < previousPlayerHealth)
            scatterCircles(20, player.pos, new Vector(150, 150), 25, healing);

        //enemy render
        enemy.render();
        //enemy effects
        if (enemy.health > previousEnemyHealth)
            scatterCircles(20, enemy.pos, new Vector(150, 150), 25, damage);
        if (enemy.health < previousEnemyHealth)
            scatterCircles(20, enemy.pos, new Vector(150, 150), 25, healing);
        drawText(enemy.pos.add(new Vector(-100, -50)), 25, intentList[intentIndex], "black");

        drawText(new Vector(320, 0), 50, "Level: " + level, "purple");
        
        //deck
        player.draw.renderStack();
        player.hand.render();
        player.discard.renderStack();
    }
    //Shopping
    if ( shopping ) {
        //clear canvas
        fillRect(new Vector(0, 0), canvasSize, backgroundColor);
        // drawText(new Vector(320, 50), 50, "Women Be Shopping", "black");
        shop.render();
        player.render()
        player.draw.renderStack();
    }
}
function reload() {
    update();
    render();
    //stat store
    previousPlayerHealth = player.health;
    previousEnemyHealth = enemy.health;
    window.setTimeout(reload, 50);
}
reload();