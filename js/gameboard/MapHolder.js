// The simple name 'Map' unfortunately is taken already, because in ECMAScript6, Map
// is a provided Collection Class.
class MapHolder {
    constructor(_board_width, _board_height, _tile_size, _groups, starting_mana=0, starting_gold=0) {
        this.sndHit = game.add.audio('hit');
        this.sndMiss = game.add.audio('miss');
        this.sndMonsterDeath = game.add.audio('monsterDeath');
        this.sndArmyDeath = game.add.audio('armyDeath');
        this.sndTownCapture=game.add.audio('townCaptured');
        this.sndMove=game.add.audio("moveUnit");
        this.sndStructureDestroyed=game.add.audio("structureDestroyed");
        this.sndDrain=game.add.audio("drain");
        this.sndLaunch = game.add.audio('launch');
        this.sndExplosion = game.add.audio('explosion');
        this.sndHeal=game.add.audio("heal");
        this.sndRefresh=game.add.audio("refresh");


        this.BOARD_WIDTH = _board_width;
        this.BOARD_HEIGHT = _board_height;
        this.TILE_SIZE = _tile_size;
        this.groups = _groups;

        this.ftm = new FloatingTextManager(this.groups["floater"]);

        this.terrain_text1 = game.add.text(8, 650, '', {font: "12px Arial", fill: "#cfd41d"});
        this.terrain_text1.visible = false;
        this.terrain_text2 = game.add.text(150, 650, '', {font: "12px Arial", fill: "#cfd41d"});
        this.terrain_text2.visible = false;

        let bmd = game.add.bitmapData(220, 140);
        bmd.ctx.beginPath();
        bmd.ctx.rect(0, 0, 220, 140);
        bmd.ctx.fillStyle = '#444444';
        bmd.ctx.fill();
        this.unit_rectangle = game.add.sprite(0, 0, bmd);
        this.unit_rectangle.visible = false;
        this.unit_text1 = game.add.text(0, 0, '', {font: "12px Arial", fill: "#cfd41d"});
        this.unit_text1.visible = false;
        this.unit_text2 = game.add.text(112, 0, '', {font: "12px Arial", fill: "#cfd41d"});
        this.unit_text2.visible = false;

        this.cursor = game.add.sprite(-100, -100, 'atlas', 'spr_cursor_0');
        this.groups["gui"].add(this.cursor);

        this.selector = game.add.sprite(-100, -100, 'atlas', 'spr_selector_0');
        this.selectorAnim = this.selector.animations.add('animate', Phaser.Animation.generateFrameNames('spr_selector_', 0, 1), 2, true);
        this.selectorAnim.speed = 3;
        this.selector.animations.play('animate');
        this.selector.army = null;
        this.groups["gui"].add(this.selector);

        this.terrainmap = new Array(this.BOARD_WIDTH);
        this.armies = [];
        this.turn = 1;
        this.mana=starting_mana;
        this.gold=starting_gold;

        console.log("MAPHOLDER CONSTRUCTOR TRIGGERED");


        this.playerTower = null;
        this.enemyTower  = null;

        this.levelScoreLabel = game.add.text(470,650,"Levelwert ("+highscoreManager.gamelevel+"):", {font: "12px Arial", fill: "#cfd41d"});
        this.townScoreLabel  = game.add.text(470,665,"Stadtwert:", {font: "12px Arial", fill: "#cfd41d"});
        this.manaScoreLabel  = game.add.text(470,680,"Manawert:", {font: "12px Arial", fill: "#cfd41d"});
        this.goldlScoreLabel = game.add.text(470,695,"Goldwert:", {font: "12px Arial", fill: "#cfd41d"});
        this.turnlScoreLabel = game.add.text(470,710,"Zugwert:", {font: "12px Arial", fill: "#cfd41d"});
        this.armyScoreLabel  = game.add.text(470,725,"Armeewert:", {font: "12px Arial", fill: "#cfd41d"});
        this.totalScoreLabel = game.add.text(470,740,"Summe:", {font: "12px Arial", fill: "#cfd41d"});

        this.levelScoreValue = game.add.text(570,650,"-", {font: "12px Arial", fill: "#cfd41d", boundsAlignH: "right"});
        this.townScoreValue  = game.add.text(570,665,"-", {font: "12px Arial", fill: "#cfd41d", boundsAlignH: "right"});
        this.manaScoreValue  = game.add.text(570,680,"-", {font: "12px Arial", fill: "#cfd41d", boundsAlignH: "right"});
        this.goldScoreValue  = game.add.text(570,695,"-", {font: "12px Arial", fill: "#cfd41d", boundsAlignH: "right"});
        this.turnScoreValue  = game.add.text(570,710,"-", {font: "12px Arial", fill: "#cfd41d", boundsAlignH: "right"});
        this.armyScoreValue  = game.add.text(570,725,"-", {font: "12px Arial", fill: "#cfd41d", boundsAlignH: "right"});
        this.totalScoreValue  = game.add.text(570,740,"-", {font: "12px Arial", fill: "#cfd41d", boundsAlignH: "right"});

        this.levelScoreValue.setTextBounds(0,0,60,15);
        this.townScoreValue.setTextBounds(0,0,60,15);
        this.manaScoreValue.setTextBounds(0,0,60,15);
        this.goldScoreValue.setTextBounds(0,0,60,15);
        this.turnScoreValue.setTextBounds(0,0,60,15);
        this.armyScoreValue.setTextBounds(0,0,60,15);
        this.totalScoreValue.setTextBounds(0,0,60,15);

        this.goldLabel =game.add.text(320,650,"Gold: -", {font: "12px Arial", fill: "#cfd41d", boundsAlignH: "right"});
        this.manaLabel =game.add.text(320,665,"Mana: -", {font: "12px Arial", fill: "#cfd41d", boundsAlignH: "right"});

        this.beneficialSpell = game.add.sprite(-1000,-1000,'atlas','spr_spell_effect_0');
        this.beneficialSpellAnim = this.beneficialSpell.animations.add('animate',Phaser.Animation.generateFrameNames('spr_spell_effect_',0,5),6,true);
        this.beneficialSpellAnim.speed=10;

        //////////////
        // FIREBALL //
        //////////////
        // TODO: Refactor into its own Management Class, either Fireball.js or Spells.js
        this.fireball = game.add.sprite(-1000,-1000, 'atlas', 'spr_fireball_0');
        this.fireballFlyAnim = this.fireball.animations.add('fly',Phaser.Animation.generateFrameNames('spr_fireball_',0,1),2,true);
        this.fireballFlyAnim.speed=10;
        this.fireballExplodeAnim = this.fireball.animations.add('explode',Phaser.Animation.generateFrameNames('spr_fireball_explosion_',0,6),7,false);
        this.fireballExplodeAnim.speed=10;

        // No more instantaneous adding everywhere via this.blabla - all attributes
        // have to be declared inside the constructor !
        Object.seal(this);
    }

    updateScoreText() {

        this.goldLabel.text = "Gold: "+this.gold+" (+"+this.getGoldPerTurn()+")";
        this.manaLabel.text = "Mana: "+this.mana+" (+"+this.getManaPerTurn()+")";

        this.storeScoreToHighscoreManager();
        this.levelScoreValue.text = ""+highscoreManager.getLevelScore();
        this.townScoreValue.text  = ""+highscoreManager.getTownScore();
        this.manaScoreValue.text  = ""+highscoreManager.getManaScore();
        this.goldScoreValue.text  = ""+highscoreManager.getGoldScore();
        this.turnScoreValue.text  = ""+highscoreManager.getTurnScore();
        this.armyScoreValue.text  = ""+highscoreManager.getUnitScore();
        this.totalScoreValue.text  = ""+(highscoreManager.getLevelScore()+highscoreManager.getTownScore()
            +highscoreManager.getManaScore()+highscoreManager.getGoldScore()
            +highscoreManager.getTurnScore()+highscoreManager.getUnitScore());
    }

    createTerrain() {
        for (let x = 0; x < this.BOARD_WIDTH; x++) {
            this.terrainmap[x] = new Array(this.BOARD_HEIGHT);
            for (let y = 0; y < this.BOARD_HEIGHT; y++) {
                let terrain = MapHolder.getRandomTerrain();
                this.terrainmap[x][y] = terrain;
                this.terrainmap[x][y].sprite = game.add.sprite(this.mapToScreen(x), this.mapToScreen(y), 'atlas', terrain.imagename);
                this.groups["terrain"].add(terrain.sprite);
            }
        }
    }



    makeGrassLandAtBoardXY(boardX, boardY) {
        if (boardX<0 || boardX>=this.BOARD_WIDTH || boardY<0 || boardY>=this.BOARD_HEIGHT) return;
        this.terrainmap[boardX][boardY] = new Terrain("Grasland", 1, 0, 1, 20, 'spr_grass_0');
        this.terrainmap[boardX][boardY].sprite = game.add.sprite(this.mapToScreen(boardX), this.mapToScreen(boardY), 'atlas', 'spr_grass_0');
        this.groups["terrain"].add(this.terrainmap[boardX][boardY].sprite);
    }

    normalizeTerrainAroundStructures() {
        let structures=[];
        structures.push(this.playerTower);
        structures.push(this.enemyTower);
        for (let i=0;i<this.armies.length;i++) {
            if (this.armies[i].armytype===ARMY_TYPE.TOWN) { structures.push(this.armies[i]);}
        }

        for (let i=0; i< structures.length; i++) {
            for (let xOff=-1;xOff<2;xOff++) {
                for (let yOff=-1;yOff<2;yOff++){
                    let xpos=structures[i].boardX+xOff;
                    let ypos=structures[i].boardY+yOff;
                    if (xpos<0 || xpos >= this.BOARD_WIDTH || ypos<0 || ypos>= this.BOARD_HEIGHT) continue;

                    if ((xOff===0 && yOff===0) || this.terrainmap[xpos][ypos].move_cost>5) {
                        // 1. Area below structure is always grass
                        // 2. Convert Water&Mountain tiles (MoveCost>5) around structures to grassland
                        this.makeGrassLandAtBoardXY(xpos, ypos);
                    }
                }
            }
        }

    }

    createTowers() {

        let pos = this.getRandomLocationNearXY(rollDice(3), rollDice(17)+1);
        console.log("Setting Player Tower Position="+pos.boardX+","+pos.boardY);
        this.playerTower = this.createArmyUnit(ARMY_TYPE.PLAYER_TOWER, pos.boardX, pos.boardY);


        pos = this.getRandomLocationNearXY(rollDice(2)+17, rollDice(17)+1);
        console.log("Setting Enemy Tower Position="+pos.boardX+","+pos.boardY);
        this.enemyTower = this.createArmyUnit(ARMY_TYPE.ENEMY_TOWER, pos.boardX, pos.boardY);
        this.terrainmap[pos.boardX][pos.boardY] = new Terrain("Grasland", 1, 0, 1, 20, 'spr_grass_0');



    }

    createTowns() {
        for (let i = 0; i < 3; i++) {
            let validPosition=false;
            while (!validPosition) {
                let xpos=rollDice(5);
                let ypos=rollDice(17)+2;
                if (this.getArmyAtBoardXY(xpos,ypos)) continue;

                this.createArmyUnit(ARMY_TYPE.TOWN, xpos, ypos);
                validPosition=true;
            }
        }
    }

    isValidBoardXY(x, y) {
        return x >= 0 && x < 20 && y >= 0 && y < 20;
    }


    updateTerrainInfo(mouseX, mouseY) {
        if (mouseX < 8 || mouseX > 8 + this.BOARD_WIDTH * this.TILE_SIZE || mouseY < 8 || mouseY > 8 + this.BOARD_WIDTH * this.TILE_SIZE) {
            this.terrain_text1.visible = false;
            this.terrain_text2.visible = false;
            this.cursor.x = -100;
            return;
        }

        let boardX = this.screenToMap(mouseX);
        let boardY = this.screenToMap(mouseY);

        if (this.isValidBoardXY(boardX, boardY)) {

            this.terrain_text1.text = this.terrainmap[boardX][boardY].getFieldDisplayString();
            this.terrain_text1.visible = true;
            this.terrain_text2.text = this.terrainmap[boardX][boardY].getValueDisplayString();
            this.terrain_text2.visible = true;

            this.cursor.x = this.mapToScreen(boardX);
            this.cursor.y = this.mapToScreen(boardY);
        }
        else this.cursor.x = -100; //Hide
    }

    updateUnitTooltip(mouseX, mouseY) {
        this.unit_text1.visible = false;
        this.unit_text2.visible = false;
        this.unit_rectangle.visible = false;

        let boardX = this.screenToMap(mouseX);
        let boardY = this.screenToMap(mouseY);
        if (this.isValidBoardXY(boardX, boardY)) {

            let army = this.getArmyAtBoardXY(boardX, boardY);
            if (army) {

                let sx = 0, sy = 0;
                if (boardX>9) sx = -200 + 32;
                if (boardY>9) sy = -140 - 32;

                //console.log(army);
                //console.log("boardX/Y="+boardX+","+boardY);
                this.unit_text1.text = army.getFieldDisplayString();
                this.unit_text1.x = this.mapToScreen(boardX) + sx;
                this.unit_text1.y = this.mapToScreen(boardY+1) + sy;
                this.unit_text1.visible = true;

                this.unit_text2.text = army.getValueDisplayString();
                this.unit_text2.x = this.mapToScreen(boardX) + 112 + sx;
                this.unit_text2.y = this.mapToScreen(boardY+1) + sy;
                this.unit_text2.visible = true;

                this.unit_rectangle.x = this.mapToScreen(boardX) + sx;
                this.unit_rectangle.y = this.mapToScreen(boardY+1) + sy;
                this.unit_rectangle.visible = true;
            }
        }
    }

    static getRandomTerrain() {
        // Original Necromancy Terrain Probabilities: 55% Grass, 20% Forest, 10% Swamp,10% Mountain, 5% Water
        let rnd = parseInt(Math.random() * 20) + 1; // Roll 1d20
        let terrain;
        switch (rnd) {
            case 1:
                //_name,_move_cost,_move_damage,_rest_gain,_def_bonus, _imagename
                terrain = new Terrain("Wasser", 99, 999, 0, 0, 'spr_water_0');
                break;
            case 2:
            case 3:
                terrain = new Terrain("Gebirge", 6, 2, -1, 30, 'spr_mountain_0');
                break;
            case 4:
            case 5 :
                terrain = new Terrain("Sumpf", 3, 4, -4, -30, 'spr_swamp_0');
                break;
            case 6:
            case 7:
            case 8:
            case 9:
                terrain = new Terrain("Waldgebiet", 2, 0, 2, 20, 'spr_forest_0');
                break;
            default:
                terrain = new Terrain("Grasland", 1, 0, 1, 20, 'spr_grass_0');
        }
        return terrain;
    }


    getFieldDisplayString(board_x, board_y) {
        return this.terrainmap[board_x][board_y].getFieldDisplayString();
    }

    getValueDisplayString(board_x, board_y) {
        return this.terrainmap[board_x][board_y].getValueDisplayString();
    }

    getTerrainAtBoardXY(boardX, boardY) {
        if (boardX < 0 || boardX >= this.BOARD_WIDTH || boardY < 0 || boardY >= this.BOARD_HEIGHT) return null;

        return this.terrainmap[boardX][boardY];
    }

    getArmyAtBoardXY(boardX, boardY) {
        for (let i = 0; i < this.armies.length; i++) {
            if (this.armies[i].boardX === boardX && this.armies[i].boardY === boardY) {
                return this.armies[i];
            }
        }
        return null;
    }

    // === MAPPING =====================================================================================================
    screenToMap(pixel) {  return parseInt((pixel - 8) / this.TILE_SIZE);  } // usable for X and Y; border of 8 pixels
    mapToScreen(n)     {  return 8 + (n * this.TILE_SIZE);  } // usable for X and Y
    // === MAPPING END =================================================================================================

    getArmyAtXY(posx, posy) {
        return this.getArmyAtBoardXY( this.screenToMap(posx), this.screenToMap(posy) );
    }

    setSelectorXY(x, y) {
        this.selector.x = this.mapToScreen(this.screenToMap(x));
        this.selector.y = this.mapToScreen(this.screenToMap(y));
    }

    hideSelector() {
        this.selector.x = -100; // Man könnte auch .visible=false setzen, macht aber m.E. hier keinen Unterschied.
    }

    removeArmyUnit(army) {

        let index=-1;
        for (let i=0;i<this.armies.length;i++) {
            if ( this.armies[i].boardX === army.boardX && this.armies[i].boardY === army.boardY) {
                index = i;
            }
        }
        if (index>-1) {

            console.log("Removing army sprite:" + army.debugstring());
            console.log(army);
            this.armies[index].sprite.destroy();
            this.armies.splice(index,1); // Remove 1 item at position index.
        }
    }

    createArmyUnit(_armytype, boardX, boardY) {
        //if (this.isOccupied(boardX,boardY)) return null;

        let sprite = game.add.sprite(-100, -100, 'atlas', spritename[_armytype]);
        this.groups["units"].add(sprite);
        sprite.x = this.mapToScreen(boardX);
        sprite.y = this.mapToScreen(boardY);

        let armyUnit = new ArmyUnit(_armytype, boardX, boardY, sprite);

        this.armies.push(armyUnit);

        return armyUnit;
    }

    isMoveOrCombatPossible(army, targetBoardX, targetBoardY, showReason=false) {
        if ((army.boardX === targetBoardX) && (army.boardY === targetBoardY)) {
            if (showReason) console.log("Same-space target location is no move. Unit: "+army.boardX+"/"+army.boardY);
            return false;
        } // target=position not considered movement
        if (Math.abs(army.boardX - targetBoardX) + Math.abs(army.boardY - targetBoardY) > 1) {
            if (showReason) console.log("Only 1 step up, down, left or right allowed");
            return false;// only x or y and only 1 increment
        }
        if (targetBoardX < 0 || targetBoardX >= this.BOARD_WIDTH || targetBoardY < 0 || targetBoardY >= this.BOARD_HEIGHT) {
            if (showReason) console.log("Illegal boardX/y target: "+ targetBoardX+"/"+targetBoardY);
            return false;// out-of-board positions are illegal
        }

        let terrain = this.getTerrainAtBoardXY(targetBoardX, targetBoardY);
        if (terrain.move_cost > army.ap) {
            if (showReason) console.log("Not enough ap. Cost="+terrain.move_cost+", unit ap="+army.ap);
            return false;// Not enough ap for terrain
        }

        let targetArmy = this.getArmyAtBoardXY(targetBoardX, targetBoardY);
        if (targetArmy) {
            if (targetArmy.faction === army.faction) {
                if (showReason) console.log("Allied armies cant stack");
                return false; // Allied armies cant stack, different faction==combat
            }
        }
        return true;
    }

    armyTypeExists(armyType) {
        let doesExist=false;
        for (let i=0; i< this.armies.length; i++) {
            if (this.armies[i].armytype === armyType) { doesExist=true; break; }
        }
        return doesExist;
    }

    refreshAp(faction) {
        for (let i=0; i<this.armies.length; i++) {
            if (this.armies[i].faction === faction) {
                this.armies[i].ap = this.armies[i].maxap;
            }
        }
    }

    getRandomLocationNearXY(boardX,boardY) {
        console.log("getRandomLocationNearXY "+boardX+","+boardY)
        let valid=false;
        let xOff, yOff;

        let range=3;
        let counter=0;
        while (!valid) {
            xOff = rollDice(range) - 2;
            yOff = rollDice(range) - 2;

            //console.log("Testing "+boardX+","+boardY);

            let occupant = this.getArmyAtBoardXY(boardX + xOff, boardY + yOff);
            let terrain = this.getTerrainAtBoardXY(boardX + xOff, boardY + yOff);

            if (!terrain) {
                // Can happen if tests outside of board. For this to happen, boardX and boardY have
                // to be a position near the edge of the board.
                counter+=1;
                if (counter>9) { range+=1;}
                continue;
            }

            valid =  ( (!occupant) && (terrain.move_cost<10) );
        }

        return { boardX: boardX+xOff, boardY: boardY+yOff };
    }

    getRandomLocationNear(army) {
        if (!army) { console.log("getRandomLocationNear(army): Army is null"); return {boardX:0, boardY:0}; }
        return this.getRandomLocationNearXY(army.boardX, army.boardY);
    }

    attackArmy(attacker,defender) {
        // COMBAT
        let terrain  = this.getTerrainAtBoardXY(defender.boardX, defender.boardY);

        if (defender.faction === FACTION.INDEPENDENT && attacker.faction===FACTION.PLAYER) {
            // CAPTURE TOWN (PLAYER ONLY)
            let xpos = this.mapToScreen(defender.boardX);
            let ypos = this.mapToScreen(defender.boardY);

            defender.sprite.destroy();
            defender.sprite = game.add.sprite(xpos,ypos, 'atlas', 'spr_town_captured_0');
            defender.faction = FACTION.PLAYER;
            this.sndTownCapture.play();

            this.removeArmyUnit(attacker);
            return GAMEBOARD_EVENT.TOWN_CAPTURED;
        } else {
            let ap_cost=terrain.move_cost;
            if (attacker.faction===FACTION.ENEMY) { ap_cost=1; }
            attacker.ap -= ap_cost;

            let roll = rollDice(100);
            if ( roll > attacker.attack - (defender.defense+terrain.def_bonus)) {
                // MISS
                this.sndMiss.play();
                this.ftm.addFloater(this.mapToScreen(defender.boardX),this.mapToScreen(defender.boardY),'Verfehlt', "#eeeeee");
                return GAMEBOARD_EVENT.NO_EFFECT;
            } else {
                // HIT
                this.sndHit.play();
                this.ftm.addFloater(this.mapToScreen(defender.boardX), this.mapToScreen(defender.boardY), '*Treffer*', "#ece812");

                //TODO: Roll for damage
                let hpChange = -attacker.rollDamage();

                return this.applyHpChangeToArmy(attacker,defender,hpChange);
            }
        }
        console.log("Unhandled branch in MapHandler.attackArmy");
        return null; // FAILSAFE
    }

    // Evil hack: Water tiles (move_cost>10)are always reported to be occupied
    isOccupied(boardX, boardY) {
        let terrain=this.getTerrainAtBoardXY(boardX,boardY);
        if (!terrain) return true; // Out of bounds
        if (terrain.move_cost>10) return true;

        let army=this.getArmyAtBoardXY(boardX,boardY);
        return (army!==null);
    }

    getAdjacentOpponentTo(army) {
        let target=null;
        let self=this;

        // Ein Versuch, Subfunktionalität zu kapseln und den Rest der Hauptfunktion lesbarer zu machen
        let getOpponentArmyAtBoardOffset=function(army, xOff, yOff) {
            let unit = self.getArmyAtBoardXY(army.boardX + xOff, army.boardY + yOff);
            if (!unit) return null;
            if (unit.faction === army.faction) {unit = null;}
            return unit;
        };

        if (army.boardX>0)                               { target=getOpponentArmyAtBoardOffset(army,-1,0); }
        if ( !target && army.boardX<this.BOARD_WIDTH-1)  { target=getOpponentArmyAtBoardOffset(army,1,0);  }
        if ( !target && army.boardY>0)                   { target=getOpponentArmyAtBoardOffset(army,0,-1); }
        if ( !target && army.boardY<this.BOARD_HEIGHT-1) { target=getOpponentArmyAtBoardOffset(army,0,1);  }

        return target;
    }

    getActionableMonster() {
        let monster=null;
        for (let i=0; i < this.armies.length; i++) {
            if (this.armies[i].faction !== FACTION.ENEMY || this.armies[i].ap<1) { continue; }
            return this.armies[i];
        }
        return null;
    }

    getNearestTownTo(boardX, boardY) {
        let currentTown=null;
        for (let i=0; i < this.armies.length; i++) {
            if (this.armies[i].armytype===ARMY_TYPE.TOWN) {
                currentTown = currentTown || this.armies[i];
                if (!currentTown) return null; // No town on board
                let dist1 = this.getDistance(currentTown, boardX, boardY);
                let dist2 = this.getDistance(this.armies[i], boardX, boardY);
                if (dist2<dist1) {currentTown=this.armies[i];}
            }
        }
        if (currentTown){
            console.log("getNearestTownTo " + boardX + "," + boardY + " => " + currentTown.debugstring());
            return currentTown;
        }
        return null;
    }

    //TODO: Refactor. Finding the nearest army ot the nearest town should be done from one unified method.
    getNearestPlayerArmyTo(boardX, boardY) {
        let currentArmy=null;
        for (let i=0; i < this.armies.length; i++) {

            if (this.armies[i].faction===FACTION.PLAYER && !this.armies[i].is_structure) {
                currentArmy = currentArmy || this.armies[i];
                if (!currentArmy) return null; // No town on board
                let dist1 = this.getDistance(currentArmy.boardX, boardX, boardY);
                let dist2 = this.getDistance(this.armies[i], boardX, boardY);
                if (dist2<dist1) {currentArmy=this.armies[i];}
            }
        }
        if (currentArmy){
            console.log("getNearestArmyTo " + boardX + "," + boardY + " => " + currentArmy.debugstring());
            return currentArmy;
        }
        return null;
    }
    getDistance(army,targetBoardX,targetBoardY) {
        // Power of 2 and square rooting is useless here, so i just add up the cathetus values
        // If it bothers you go ahead and change the formula :-)
        return Math.abs(army.boardX-targetBoardX)+Math.abs(army.boardY-targetBoardY);
    }

    getTownCount() {
        let townCount=0;
        for (let i=0; i<this.armies.length; i++) {
            if (this.armies[i].armytype===ARMY_TYPE.TOWN && this.armies[i].faction === FACTION.PLAYER) { townCount+=1; }
        }
        return townCount;
    }

    getPlayerArmies() {
        let armies=[];
        for (let i=0; i<this.armies.length; i++) {
            if (this.armies[i].faction===FACTION.PLAYER && !this.armies[i].is_structure){
                armies.push(this.armies[i]);
            }
        }
        return armies;
    }


    storeScoreToHighscoreManager(){
        //this.listStructures();
        highscoreManager.armies = this.getPlayerArmies();
        highscoreManager.gold   = this.gold;
        highscoreManager.mana   = this.mana;
        highscoreManager.towns  = this.getTownCount();
        highscoreManager.turn   = this.turn;
    }

    listStructures() {
        console.log("Structures list:");
        for (let i=0;i<this.armies.length; i++) {
            if (this.armies[i].is_structure) {console.log(""+this.armies[i].boardX+","+this.armies[i].boardY+" => "+this.armies[i].name);}
        }
        console.log("*******************");
    }

    applyHpChangeToArmy(sender,receiver,_hpChange) {
        let hpChange = Math.min(receiver.maxhp-receiver.hp,_hpChange); // Maximum gain only up to max hitpoints

        if (hpChange) {
            let str="Heilung ";
            if (hpChange<0) str="Schaden ";
            this.ftm.addFloater(this.mapToScreen(receiver.boardX), this.mapToScreen(receiver.boardY), ''+hpChange+' '+str, "#ffddf3");
        }

        receiver.hp += hpChange;

        if (hpChange>0) {
            return GAMEBOARD_EVENT.UNIT_HEALED;
        }

        // Special Attacker Ability Check, hardcoded.
        // Only if attacker exists
        if (sender) {
            if (rollDice(100)<= sender.special_ability_prc && !receiver.is_structure) {
                this.sndDrain.play();
                if (sender.armytype===ARMY_TYPE.GHOUL) {
                    let dmg = rollDice(4);
                    this.ftm.addFloater(this.mapToScreen(receiver.boardX),this.mapToScreen(receiver.boardY),'Lähmung: '+dmg+' Bewegung');
                    receiver.ap = Math.max(0, receiver.ap - dmg);
                } else if (sender.armytype===ARMY_TYPE.BANSHEE) {
                    let dmg = rollDice(6);
                    this.ftm.addFloater(this.mapToScreen(receiver.boardX),this.mapToScreen(receiver.boardY),'Lebenskraft-Entzug: '+dmg+' Leben');
                    receiver.maxhp = Math.max(1, receiver.maxhp - dmg);
                }
            }
        }

        // Check death

        if (receiver.hp <=0) {
            if (receiver.is_structure) {
                this.sndStructureDestroyed.play();
            } else if (receiver.faction === FACTION.ENEMY) {
                this.sndMonsterDeath.play();
                if (sender) { sender.levelUp(receiver,this.ftm); }
            } else {
                this.sndArmyDeath.play();
            }

            this.ftm.addFloater(this.mapToScreen(receiver.boardX), this.mapToScreen(receiver.boardY), 'Einheit vernichtet', "#fff811");
            this.removeArmyUnit(receiver);
            return GAMEBOARD_EVENT.UNIT_DESTROYED;
        }

        return GAMEBOARD_EVENT.UNIT_DAMAGED;
    }

    getGoldPerTurn() {
        let goldPerTurn=0;
        for (let i=0;i<this.armies.length;i++) {
            let army= this.armies[i];
            if (army.faction === FACTION.PLAYER) {
                goldPerTurn+=army.generate_gold;
            }
        }
        return goldPerTurn;
    }

    getManaPerTurn() {
        let manaPerTurn=0;
        for (let i=0;i<this.armies.length;i++) {
            let army= this.armies[i];
            if (army.faction === FACTION.PLAYER) {
                manaPerTurn+=army.generate_mana;
            }
        }
        return manaPerTurn;
    }


    applyNextTurnEffects() {
        // 1. Add Gold
        // 2. Add Mana
        // 3. Refresh Player Army AP
        // 4. Heal or damage player armies according to terrain

        this.gold += this.getGoldPerTurn();
        this.mana += this.getManaPerTurn();

        for (let i=0;i<this.armies.length;i++) {



            let army=this.armies[i];
            if (army.faction === FACTION.PLAYER && !army.is_structure) {
                army.ap =army.maxap;

                console.log("Checking terrain at "+army.boardX+","+army.boardY);
                let terrain = this.getTerrainAtBoardXY(army.boardX,army.boardY);
                let hpChange = Math.min(army.maxhp-army.hp,terrain.rest_gain); // Maximum gain only up to max hitpoints
                if (hpChange) {
                    this.applyHpChangeToArmy(null,army,hpChange); // Method is hardened to accept attacker==null
                }
            }
            this.ftm.clearCache();
        }
    }

    buyArmy(ARMY_TYPE) {
        let goldNeeded = army_cost[ARMY_TYPE];
        if (this.gold < goldNeeded) {
            this.ftm.addFloater( 400,600, 'Nicht genug Gold');
            return GAMEBOARD_EVENT.INSUFFICIENT_GOLD;
        }

        this.gold -= goldNeeded;

        let pos = this.getRandomLocationNear(this.playerTower);
        this.createArmyUnit(ARMY_TYPE,pos.boardX, pos.boardY);

    }

}