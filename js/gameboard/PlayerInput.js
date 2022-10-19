class PlayerInput {
    constructor(_mapholder) {
        this.mapHolder = _mapholder;
    }

    checkFireballCastClick() {

        if (game.input.activePointer.leftButton.isDown) {

            let army = this.mapHolder.getArmyAtXY(game.input.activePointer.position.x, game.input.activePointer.position.y);

            if (army && !army.isStructure() && army.faction === FACTION.ENEMY) {


                this.mapHolder.sndLaunch.play();
                this.mapHolder.fireball.x = this.mapHolder.mapToScreen(this.mapHolder.playerTower.boardX);
                this.mapHolder.fireball.y = this.mapHolder.mapToScreen(this.mapHolder.playerTower.boardY);
                console.log("FIREBALL_ON_ITS_WAY ! " + this.mapHolder.fireball.x+","+this.mapHolder.fireball.y);

                this.flyTween = game.add.tween(this.mapHolder.fireball);

                let armyX = this.mapHolder.mapToScreen(army.boardX);
                let armyY = this.mapHolder.mapToScreen(army.boardY);

                this.flyTween.to({x: armyX, y: armyY},1000);

                let self=this;
                this.flyTween.onComplete.addOnce(function(sprite/*,event*/) {
                    self.mapHolder.sndExplosion.play();
                    self.mapHolder.fireballExplodeAnim.play();
                    self.mapHolder.fireballExplodeAnim.onComplete.addOnce(function() {
                        self.mapHolder.fireball.x = -1000;
                        let damage = rollDice(6)+rollDice(6)+rollDice(6)+6;
                        self.mapHolder.applyHpChangeToArmy(null,army,-damage);
                    }, this);
                },this);

                this.flyTween.start();

                this.mapHolder.fireball.animations.play('fly');

                return GAMEBOARD_EVENT.SPELL_TARGET_SELECTED;
            }
        }
        return GAMEBOARD_EVENT.NO_EFFECT;
    }

    checkHealCastClick() {
        if (game.input.activePointer.leftButton.isDown) {

            let army = this.mapHolder.getArmyAtXY(game.input.activePointer.position.x, game.input.activePointer.position.y);

            if (army && !army.isStructure() && army.faction === FACTION.PLAYER) {


                let army = this.mapHolder.getArmyAtXY( game.input.mousePointer.x,game.input.mousePointer.y);
                if (!army) return;
                if (army.faction!=FACTION.PLAYER || army.isStructure()) return;

                if (army.hp===army.maxhp) {
                    this.mapHolder.ftm.addFloater(game.input.mousePointer.x,game.input.mousePointer.y, "Einheit ist nicht verletzt.");
                    return;
                }

                this.mapHolder.beneficialSpell.x = this.mapHolder.mapToScreen(army.boardX);
                this.mapHolder.beneficialSpell.y = this.mapHolder.mapToScreen(army.boardY);

                let self=this;
                game.time.events.add(Phaser.Timer.SECOND * 3, function() {self.mapHolder.beneficialSpell.x=-1000;}, this);

                this.mapHolder.beneficialSpellAnim.play();
                this.mapHolder.sndHeal.play();

                this.mapHolder.mana-=SPELL_COST.HEAL;

                army.hp = army.maxhp;
                return GAMEBOARD_EVENT.SPELL_TARGET_SELECTED;
            }
        }
        return GAMEBOARD_EVENT.NO_EFFECT;
    }

    checkRefreshCastClick(){
        if (game.input.activePointer.leftButton.isDown) {
            let army = this.mapHolder.getArmyAtXY(game.input.activePointer.position.x, game.input.activePointer.position.y);
            if (army && !army.isStructure() && army.faction === FACTION.PLAYER) {
                let army = this.mapHolder.getArmyAtXY( game.input.mousePointer.x,game.input.mousePointer.y);
                if (!army) return;
                if (army.faction!=FACTION.PLAYER || army.isStructure()) return;

                if (army.ap===army.maxap) {
                    this.mapHolder.ftm.addFloater(game.input.mousePointer.x,game.input.mousePointer.y, "Einheit ist nicht erschöpft.");
                    return;
                }

                this.mapHolder.beneficialSpell.x = this.mapHolder.mapToScreen(army.boardX);
                this.mapHolder.beneficialSpell.y = this.mapHolder.mapToScreen(army.boardY);

                let self=this;
                game.time.events.add(Phaser.Timer.SECOND * 3, function() {self.mapHolder.beneficialSpell.x=-1000;}, this);

                this.mapHolder.beneficialSpellAnim.play();
                this.mapHolder.sndRefresh.play();

                this.mapHolder.mana-=SPELL_COST.REFRESH;

                army.ap = army.maxap;
                return GAMEBOARD_EVENT.SPELL_TARGET_SELECTED;
            }
        }
        return GAMEBOARD_EVENT.NO_EFFECT;
    }


    selectFriendlyUnit()  {
        if (game.input.activePointer.leftButton.isDown) {
            let army = this.mapHolder.getArmyAtXY(game.input.activePointer.position.x,  game.input.activePointer.position.y);

            if (army && !army.isStructure()) {
                console.log("ap="+army.ap+"/"+army.maxap);

                this.mapHolder.setSelectorXY(game.input.activePointer.position.x,  game.input.activePointer.position.y);
                this.mapHolder.selector.army = army;
                return "SET_MOVE";
            } else {
                this.mapHolder.hideSelector();
            }
        }

        // i dont want to access & change Gameboards' updateCallback from here. PlayerInput only signals if change is needed
        // And i dont want to create Event classes for this, either. At least not now.
        return "NO_CALLBACK_CHANGE";
    }


    // Handle Player Movement, Town Capture, attack, and (hopefully) winning the game
    moveUnit() {

        if (game.input.activePointer.leftButton.isDown) {
            this.mapHolder.ftm.clearCache(); // Remove any remaining Floater y-offset

            let boardTargetX = parseInt((game.input.activePointer.position.x-8) / this.mapHolder.TILE_SIZE);
            let boardTargetY = parseInt((game.input.activePointer.position.y-8) / this.mapHolder.TILE_SIZE);
            //console.log("targetBoardXY"+boardTargetX+"/"+boardTargetY);

            let clicked_army = this.mapHolder.getArmyAtXY(game.input.activePointer.position.x,  game.input.activePointer.position.y);

            if (clicked_army) { // Move to army occupied space
                if (clicked_army.faction == FACTION.PLAYER) {
                    // Switch focus to the other clicked player-owned army
                    this.mapHolder.setSelectorXY(game.input.activePointer.position.x,  game.input.activePointer.position.y);
                    this.mapHolder.selector.army = clicked_army;
                    return "NO_CALLBACK_CHANGE";
                }

                if (!this.mapHolder.isMoveOrCombatPossible(this.mapHolder.selector.army, boardTargetX, boardTargetY)) { console.log("Move to army impossible"); return; }

                // COMBAT
                let attacker = this.mapHolder.selector.army;
                let defender = clicked_army;

                let result = this.mapHolder.attackArmy(attacker,defender);
                console.log("Combat result for Army "+attacker.debugstring()+" => "+ result);
                switch (result) {
                    case GAMEBOARD_EVENT.TOWN_CAPTURED:
                        return "SET_INPUT";
                    case GAMEBOARD_EVENT.UNIT_DESTROYED:
                        console.log("Destroyed result recognized");
                        console.log("Enemy tower exists = "+this.mapHolder.armyTypeExists(ARMY_TYPE.ENEMY_TOWER));
                        if (!this.mapHolder.armyTypeExists(ARMY_TYPE.ENEMY_TOWER)) {
                            console.log("Returning 'VICTORY'");
                            return "VICTORY";
                        }
                        return "DELAY_BEFORE_MOVE";
                    default:
                        return "DELAY_BEFORE_MOVE"
                }
                // END OF COMBAT PART
            } else { // Move to army empty space
                let terrain = this.mapHolder.getTerrainAtBoardXY(boardTargetX, boardTargetY);
                if (!this.mapHolder.isMoveOrCombatPossible(this.mapHolder.selector.army, boardTargetX, boardTargetY)) { console.log("Move to terrain impossible"); return; }
                this.mapHolder.selector.army.ap -= terrain.move_cost;
                this.mapHolder.selector.army.boardX = boardTargetX;
                this.mapHolder.selector.army.boardY = boardTargetY;
                this.mapHolder.selector.army.sprite.x = 8+ boardTargetX * this.mapHolder.TILE_SIZE;
                this.mapHolder.selector.army.sprite.y = 8+ boardTargetY * this.mapHolder.TILE_SIZE;
                this.mapHolder.sndMove.play();

                if (terrain.move_damage) {
                    console.log("Move Damage = "+terrain.move_damage+"   hp before:"+this.mapHolder.selector.army.hp);
                    this.mapHolder.applyHpChangeToArmy(null,this.mapHolder.selector.army,-terrain.move_damage);
                    console.log("HP after="+this.mapHolder.selector.army.hp);
                }

                console.log("Terrain move army_cost="+terrain.move_cost);
                console.log("New boardX/boardY: "+this.mapHolder.selector.army.boardX+"/"+this.mapHolder.selector.army.boardY);
                return "SET_INPUT";
            }
        }


    }



}