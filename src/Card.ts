import CardEffects from './CardEffects';
import Effect from './Effects';
import { randomFloor, Vector } from './math';
import { fillRectCenter, fillRect, strokeRect, drawText, canvas } from "./render";
import Unit from './Unit';

type ApplyFunction = ( receiver: Unit, dealer: Unit ) => void

export default class Card {
    //postioning
    pos : Vector;
    offset : Vector;
    angle : number;
    bump : number = 0;
    bumpMax : number = 25;
    //UI
    selected : boolean;
    active : boolean;

    //scaling
    size = new Vector(2/3, 1);
    scale : number;
    minScale : 100 = 100;
    maxScale = 200;
    

    cost : number;
    color : string;
    detail : string = "Null";
    
    onApply?: ApplyFunction;
    effect?: Effect;

    constructor( effect: Effect = CardEffects.Triage ) {
        //translation
        this.pos = new Vector(0, 0);
        this.offset = new Vector(0, 0);
        this.newOffset(8);
        this.angle = 0;
        this.spin(30);
        
        //scaling
        this.size = new Vector(3/4, 1);
        this.scale = 100;
        this.active = false;
        
        //effect
        this.color = `rgb(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255})`;

        this.onApply = () => {};
        this.effect = effect;
    }
    get dimensions() {
        return this.size.scale(this.scale)
    }
    align(speed: number = 0.9) {
        this.angle = this.angle * speed;
        this.offset.x = this.offset.x * speed;
        this.offset.y = this.offset.y * speed;
    }
    newOffset(range: number = 8) {
        this.offset = new Vector(randomFloor(range*2) - range, randomFloor(range*2) - range);
    }
    spin(angle: number = 10) {
        this.angle += randomFloor(angle) - angle/2;
    }
    contains(point: Vector) {
        let near = this.pos.add(this.offset.add(new Vector(0, -this.bump)));
        let far = near.add(this.dimensions);
        if (point.x >= near.x && point.x <= far.x) {
            if (point.y >= near.y && point.y <= far.y) {
                return true
            }
            return false
        }
        return false
    }
    update() {
        let { bump, bumpMax, maxScale, minScale } = this
        if ( this.selected ) {
            this.bump += 10;
            if (bump >= bumpMax)
                this.bump = bumpMax;
            this.scale += 20;
            if ( this.scale > maxScale )
                this.scale = maxScale;

        } else {
            // this.bump = bump * 0.6;
            this.bump = 0;
            this.scale = minScale;
        }
    }
    seek(point) {
        let dist = point.subtract(this.pos);
        this.active = true
        if (point.subtract(this.pos).length > 3) {
            let fix = dist.multiply(0.5);
            this.pos = this.pos.add(fix);
        } else {
            this.active = false
        }
    }
    render( details: boolean = true ) {
        let { pos, offset, dimensions, bump } = this
        let ctx = canvas.getContext("2d");
        let offPos = offset.add(new Vector(-bump, -bump));

        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.rotate(this.angle * Math.PI / 180);

        //current Cost place holder
        if ( details ) {
            fillRect(offPos, dimensions, this.effect.color);
            //TITLE
            let textSize = this.scale / 8;
            let textPos = offPos.add(new Vector(-textSize/2, 0));
            drawText(textPos, textSize+textSize/30 , this.effect.name, "black");
            drawText(textPos, textSize , this.effect.name, "white");
            
            //description text
            let detailSize = this.scale / 9;
            let detailText = this.effect.description.split(", ");
            let detailPos = offPos.add(new Vector(-detailSize/2, detailSize*3));
            detailText.forEach((value, index) => {
                let linePos = detailPos.add(new Vector(0, detailSize*index));
                drawText(linePos, detailSize, value, "white");
                // drawText(linePos, detailSize+detailSize/20, value, "black");
            });
        } else {
            fillRect(offPos, dimensions, "grey");
        }
        strokeRect(offPos, dimensions, "black");

        //reset canvas rotation and translation
        ctx.restore();
    }
}