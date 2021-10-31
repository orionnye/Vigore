import Unit from "./Unit";
import Effect from "./Effects";

const CardEffects = {
    //Simple Cards
    Strike: new Effect((user, target) => {
        target.health -= 3
    }, "inflict -3 hp"),
    Triage: new Effect((user, target) => {
        target.health += 3
    }, "inflict +3 hp"),
    //Complex Cards
    Syphon: new Effect((user, target) => {
        user.health += 3;
        target.health -= 3;
        user.maxHealth -= 1;
    }, "inflict: -3 hp, recieve: +3 hp,      & -1 mp"),
    FleshWound: new Effect((user, target) => {
        target.health -= 6;
        target.maxHealth += 2;
    }, "inflict: -6 hp,     & +2 mp"),
    Tearstone: new Effect((user, target) => {
        target.health -= user.maxHealth - user.health;
    }, "inflict:, (hp - mp) hp")
}

for ( let key in CardEffects ) {
    let type = CardEffects[ key ]
    type.name = key
}
CardEffects.Strike.color = "rgba(150, 0, 0)"
CardEffects.Triage.color = "rgba(255, 100, 100)"

export default CardEffects