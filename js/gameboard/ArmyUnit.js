const ARMY_TYPE = {
    NONE: -1,
    MILITIA: 0,
    LIGHT_INF: 1,
    HEAVY_INF: 2,
    PLAYER_TOWER: 3,
    ENEMY_TOWER: 4,
    TOWN: 5,
    SKELETON: 6,
    GHOUL: 7,
    BANSHEE: 8
};

const GAMEBOARD_EVENT = {
    NO_EFFECT: 0,
    UNIT_DAMAGED: 1,
    UNIT_DESTROYED: 2,
    TOWN_CAPTURED: 3,
    UNIT_HEALED: 4,
    INSUFFICIENT_GOLD: 5,
    INSUFFICIENT_MANA: 6,
    SPELL_TARGET_SELECTED: 7
}

const SPELL_TYPE = {
    NONE: 0,
    FIREBALL: 1,
    HEAL: 2,
    REFRESH: 3
}

const SPELL_COST = {
    FIREBALL : 12,
    HEAL: 8,
    REFRESH: 10
}

const FACTION = { PLAYER: 1, ENEMY: 2, INDEPENDENT :3};

const attack_val =  [ 70,80,90,0,0,0,70,80,90];
const defense_val=  [ 10,20,30,10,10,10,10,10,30];
const is_structure= [ false,false,false,true,true,true,false,false,false];
const generate_gold=[0,0,0,5,0,3,0,0,0];
const army_cost    =[8,15,25,0,0,0,0,0,0];
const generate_mana=[0,0,0,3,0,3,0,0,0];
const dmg_min=      [1,4,7,0,0,0,2,3,3];
const dmg_max=      [8,9,12,0,0,0,8,10,10];
const maxhp=        [10,10,30,20,30,20,5,15,20];
const maxap=        [4,6,4,0,0,0,1,2,3];
const spec_abil=    [0,0,0,0,0,0,0,100,100]; // Orig: 30
const faction=      [1,1,1,1,2,3,2,2,2];
const spritename=   ['spr_army_0','spr_light_inf_0','spr_heavy_inf_0','spr_player_tower_0','spr_enemy_tower_0','spr_town_0','spr_skeleton_0','spr_ghoul_0','spr_banshee_0'];
const startlevel=   [1,1,1,1,1,1,1,2,3];
const armyNames=    ["Füsiliere", "Infantrie", "goldene Legion", "Turm des Magiers", "Turm des Nekromanten", "Dorf", "Skelette", "Ghule", "Todesfee"];
const villageNames= ["Keuwin", "Arkenham", "Rondor", "Runkelheim", "Hallnabar"];

let armyNumbers          = [];
let nextArmyNumber       = 0;
let nextVillageNameIndex = -1;

class ArmyUnit {
    // Unfortunately, JavaScript doesnt have function overloading, so we cant just write
    // multiple constructors with different signatures. :-(
    constructor(_armytype, _boardX, _boardY, _sprite) {

        this.name = this.createNameFor(_armytype);
        this.armytype = _armytype;
        this.boardX = _boardX;
        this.boardY = _boardY;
        this.is_structure = is_structure[_armytype];
        this.generate_gold = generate_gold[_armytype];
        this.generate_mana = generate_mana[_armytype];
        this.level=startlevel[_armytype];

        this.attack=attack_val[_armytype];
        this.defense=defense_val[_armytype];
        this.damage_min = dmg_min[_armytype];
        this.damage_max = dmg_max[_armytype];
        this.maxhp = maxhp[_armytype];
        this.hp = maxhp[_armytype];
        this.maxap = maxap[_armytype];
        this.ap = maxap[_armytype];

        this.cost = army_cost[_armytype];

        this.special_ability_prc=spec_abil[_armytype];
        this.faction=faction[_armytype];
        this.sprite=_sprite;
        
    }

    createNameFor(armytype) {
        let name = armyNames[armytype];
        if (armytype<=ARMY_TYPE.HEAVY_INF) {
        
            if (nextArmyNumber === 0) { // initialize array
                for (let i=0; i<12; i++) {  armyNumbers.push( i+1 ); }
            }
            
            // Randomize array element order in-place. Using the Durstenfeld shuffle algorithm.
            for (let i = armyNumbers.length - 1; i > 0; i--) {
                let j = rollDice(i);
                let temp = armyNumbers[i];
                armyNumbers[i] = armyNumbers[j];
                armyNumbers[j] = temp;
            }
            
            nextArmyNumber++;
            let n = (armyNumbers.length>0 ? armyNumbers.pop() : nextArmyNumber);
            name = n + "te " + name;
            if (armytype === ARMY_TYPE.MILITIA  ) { name = n + "te " + selectRandom(villageNames) + " Füsiliere"; }
            if (armytype === ARMY_TYPE.LIGHT_INF) { name = n + "te leichte " + selectRandom(villageNames) + " Inf."; }
        }
        if (armytype === ARMY_TYPE.TOWN) {
            nextVillageNameIndex = (nextVillageNameIndex + 1) % villageNames.length; // MODULO
            name = villageNames[nextVillageNameIndex];
        }
        return name;
    }

    getLevelName() {
        switch (this.level) {
            case 1: return "[1] Rekrut";
            break;
            case 2: return "[2] Scharmützler";
            break;
            case 3: return "[3] Veteran";
            break;
            case 4: return "[4] Elite";
            break;
            case 5: return "[5] Legende";
            break;
            default: return "[?] Unbekannt";
        }
        return "[??] Unbekannt";
    }

    levelUp(enemy, ftm) { // FTM=FloatingTextManager
        if (this.level==3 && enemy.level<2) return; // Aufstieg auf Level 4 nur durch Ghule & Banshees
        if (this.level==4 && enemy.level<3) return; // Aufstieg auf Level 5 nur durch Banshees
        switch(this.level) {
            case 1:
                ftm.addFloater(this.sprite.x, this.sprite.y,"Angriff +5%");
                ftm.addFloater(this.sprite.x, this.sprite.y,"Leben +2");
                this.attack+=5;
                this.maxhp+=2;
                this.level+=1;
                break;
            case 2:
                ftm.addFloater(this.sprite.x, this.sprite.y,"Verteidigung +5%");
                ftm.addFloater(this.sprite.x, this.sprite.y,"Leben +2");
                this.defense+=5;
                this.maxhp+=2;
                this.level+=1;
                break;
            case 3:
                ftm.addFloater(this.sprite.x, this.sprite.y,"Angriff +10%");
                ftm.addFloater(this.sprite.x, this.sprite.y,"Leben +5");
                this.attack+=10;
                this.maxhp+=5;
                this.level+=1;
                break;
            case 4:
                ftm.addFloater(this.sprite.x, this.sprite.y,"Angriff +5%");
                ftm.addFloater(this.sprite.x, this.sprite.y,"Leben +2");
                this.defense+=10;
                this.maxap+=2;
                this.level+=1;
                break;
        }
    }

    isStructure() {
        return (this.armytype === ARMY_TYPE.TOWN || this.armytype === ARMY_TYPE.PLAYER_TOWER || this.armytype === ARMY_TYPE.ENEMY_TOWER);
    }

    getValueDisplayString() {
        return "\n"
            +this.hp+" / "+this.maxhp+"\n"
            +this.ap+" / "+this.maxap+"\n"
            +this.attack+" %\n"
            +this.defense+" %\n"
            
            +"\n"  // besonderer Name? "untoter Fu�trupp"
            +"\n"; // Aktion
    }

    getFieldDisplayString() {
        let str=this.name;
        if (this.faction==FACTION.PLAYER && !this.is_structure) { str+=" "+this.getLevelName();}
        str+= "\nLeben:\nBewegung:\nAngriff:\nVerteidigung:";
        if (this.generate_gold) { str+="\nProduziert "+this.generate_gold+" Gold";}
        if (this.generate_mana) { str+="\nProduziert "+this.generate_mana+" Mana";}
        if (this.armytype==ARMY_TYPE.GHOUL) {str+="\nEntzieht AP";}
        if (this.armytype==ARMY_TYPE.BANSHEE) {str+="\nEntzieht Max HP";}
        return str;
    }

    rollDamage() {
        return rollDice(this.damage_max)+this.damage_min;
    }

    debugstring() { return this.name+" ap="+this.ap+" pos=["+this.boardX+","+this.boardY+"]"; }

    getScore() {
        let baseValue=6;
        if (this.armytype==ARMY_TYPE.LIGHT_INF) { baseValue=8; }
        if (this.armytype==ARMY_TYPE.HEAVY_INF) { baseValue=10;}

        let levelMultiplier=[0,1,2,5,10,20];

        return baseValue * levelMultiplier[this.level];
    }
}
