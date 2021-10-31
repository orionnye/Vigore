import Unit from "./Unit"

type ApplyFunction = ( receiver: Unit, dealer: Unit ) => void

export default class Effect {
    name: string;
    color: string = "teal";
    userHealth? : number;
    userMaxHealth? : number;
    targetHealth? : number;
    targetMaxHealth? : number;
    description? : string;
    onApply? : ApplyFunction;
    
    //perhaps two functions stored on Effect
    //one to calculate damage "INPUT"
    //and one to play effect "OUTPUT"
    
    constructor( onApply = ( user, target ) => {}, description: string) {
        this.name = "null"
        this.userHealth = 0;
        this.userMaxHealth = 0;
        this.targetHealth = 0;
        this.targetMaxHealth = 0;
        this.description = description;
        
        this.onApply = onApply;
    }
    get basicText() {
        let { userHealth, userMaxHealth, targetHealth, targetMaxHealth } = this
        let text = "";
        if (targetHealth || targetMaxHealth) {
            text += "inflict:";
            if (targetHealth) {
                text += ` ${targetHealth}h`;
                if (targetMaxHealth)
                    text += " &&";
            }
            if (targetMaxHealth)
                text += ` ${targetMaxHealth}H`;
            if (userHealth || userMaxHealth)
                text += ", ";
        }
        if (userHealth || userMaxHealth) {
            text += "incur:"
            if (userHealth) {
                text += ` ${userHealth}h`
                if (userMaxHealth)
                    text += " &&"
            }
            if (userMaxHealth)
                text += ` ${userMaxHealth}H`
        }

        return text;
    }
}