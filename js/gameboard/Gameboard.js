class Gameboard {

    constructor(mouseCursor) {

        this.terrain_group = game.add.group();
        this.army_group = game.add.group();
        this.gui_group = game.add.group();
        this.floater_group = game.add.group();
        this.groups = { "terrain": this.terrain_group,
            "units"   : this.army_group,
            "gui"   : this.gui_group,
            "floater": this.floater_group};

        this.btnCastFireball = game.add.sprite( 190, 650, 'atlas', 'spr_icon_fireball');
        this.groups["gui"].add(this.btnCastFireball);
        this.btnCastFireball.inputEnabled=true;
        this.btnCastFireball.events.onInputUp.add(this.clickFireball,this);

        this.btnCastHeal = game.add.sprite( 230, 650, 'atlas', 'spr_icon_heal');
        this.groups["gui"].add(this.btnCastHeal);
        this.btnCastHeal.inputEnabled=true;
        this.btnCastHeal.events.onInputUp.add(this.clickHeal,this);

        this.btnCastRefresh  = game.add.sprite( 270, 650, 'atlas', 'spr_icon_refresh');
        this.groups["gui"].add(this.btnCastRefresh);
        this.btnCastRefresh.inputEnabled=true;
        this.btnCastRefresh.events.onInputUp.add(this.clickRefresh,this);

        this.btnBuyMilitia   = game.add.sprite( 190, 690, 'atlas', 'spr_icon_buy_militia');
        this.groups["gui"].add(this.btnBuyMilitia);
        this.btnBuyMilitia.inputEnabled=true;
        this.btnBuyMilitia.events.onInputUp.add(this.buyMilitia,this);

        this.btnBuyLightInf  = game.add.sprite( 230, 690, 'atlas', 'spr_icon_buy_light_inf');
        this.groups["gui"].add(this.btnBuyLightInf);
        this.btnBuyLightInf.inputEnabled=true;
        this.btnBuyLightInf.events.onInputUp.add(this.buyLightInf,this);

        this.btnBuyHeavyInf  = game.add.sprite( 270, 690, 'atlas','spr_icon_buy_heavy_inf');
        this.groups["gui"].add(this.btnBuyHeavyInf);
        this.btnBuyHeavyInf.inputEnabled=true;
        this.btnBuyHeavyInf.events.onInputUp.add(this.buyHeavyInf,this);

        this.BOARD_WIDTH = 20;
        this.BOARD_HEIGHT = 20;
        this.TILE_SIZE = 32;

        this.updateCallback = this.initGame;
        this.sndClick = game.add.audio('click');

        //Object.seal(this.groups);

        this.mapHolder = new MapHolder(this.BOARD_WIDTH, this.BOARD_HEIGHT, this.TILE_SIZE,this.groups,10,5);
        this.ai = new AI(this.mapHolder);
        this.playerInput = new PlayerInput(this.mapHolder);

        // For Testing only
        // this.mapHolder.createArmyUnit(ARMY_TYPE.MILITIA,1,1);
        // this.mapHolder.createArmyUnit(ARMY_TYPE.SKELETON,1,2);
        // this.mapHolder.createArmyUnit(ARMY_TYPE.GHOUL,2,1);

        this.btn_next_turn = game.add.sprite(320, 700, 'atlas', 'spr_next_turn_0');
        this.groups["gui"].add(this.btn_next_turn);
        this.btn_next_turn.inputEnabled=true;
        let self=this;
        this.btn_next_turn.events.onInputDown.add( function() {
            if (self.btn_next_turn.alpha<1) return;
            self.btn_next_turn.alpha=.5;
            self.sndClick.play();
            self.mapHolder.selector.x=-100;
            self.mapHolder.refreshAp(FACTION.ENEMY);
            self.updateCallback = self.aiAction;
        });

        this.currentSpell = SPELL_TYPE.NONE;

        // create mouse cursor as last sprite to have it appear on top:
        this.mouseCursor = game.add.sprite(game.input.mousePointer.x,game.input.mousePointer.y,'atlas','spr_mouse_0');
        //this.mouseCursor.loadTexture('atlas','spr_mouse_cast_0');
        this.mouseCastAnim = this.mouseCursor.animations.add('cast',Phaser.Animation.generateFrameNames('spr_mouse_cast_',0,1),3,true);
        this.mouseCastAnim.speed=10;
        this.mouseDefaultCursorAnim = this.mouseCursor.animations.add('default',Phaser.Animation.generateFrameNames('spr_mouse_',0,0),1,true);
        this.groups["gui"].add(this.mouseCursor);


        this.escKey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);

    }

    clickFireball() {
        if (this.mapHolder.mana < SPELL_COST.FIREBALL) {
            this.mapHolder.ftm.addFloater(game.input.mousePointer.x,game.input.mousePointer.y, "Nicht genug Mana");
            return;
        }
        if (   !this.mapHolder.armyTypeExists(ARMY_TYPE.SKELETON)
            && !this.mapHolder.armyTypeExists(ARMY_TYPE.GHOUL)
            && !this.mapHolder.armyTypeExists(ARMY_TYPE.BANSHEE)
        ) {
            this.mapHolder.ftm.addFloater(game.input.mousePointer.x,game.input.mousePointer.y, "Kein Ziel vorhanden")
            return;
        }
        this.mapHolder.mana -= SPELL_COST.FIREBALL;
        this.currentSpell = SPELL_TYPE.FIREBALL;
        this.mouseCastAnim.play();
        this.updateCallback = this.playerSelectSpellTarget;
    }
    clickHeal() {
        console.log("Heal clicked");
        if (this.mapHolder.mana < SPELL_COST.HEAL) {
            this.mapHolder.ftm.addFloater(game.input.mousePointer.x,game.input.mousePointer.y, "Nicht genug Mana");
            return;
        }
        this.currentSpell = SPELL_TYPE.HEAL;
        this.mouseCastAnim.play();

        this.updateCallback = this.playerSelectSpellTarget;

    }

    clickRefresh() {
        if (this.mapHolder.mana < SPELL_COST.REFRESH) {
            this.mapHolder.ftm.addFloater(game.input.mousePointer.x,game.input.mousePointer.y, "Nicht genug Mana");
            return;
        }
        this.currentSpell = SPELL_TYPE.REFRESH;
        this.mouseCastAnim.play();
        this.updateCallback = this.playerSelectSpellTarget;

    }
    buyMilitia() {
        this.mapHolder.ftm.addFloater(190, 690, "Miliz kaufen");
        this.playerInput.mapHolder.buyArmy(ARMY_TYPE.MILITIA);
    }
    buyLightInf() {
        this.mapHolder.ftm.addFloater(230, 690, "Infanterie kaufen");
        this.playerInput.mapHolder.buyArmy(ARMY_TYPE.LIGHT_INF);
    }
    buyHeavyInf() {
        this.mapHolder.ftm.addFloater(270, 690, "Ritter kaufen");
        this.playerInput.mapHolder.buyArmy(ARMY_TYPE.HEAVY_INF);
    }

    updateSpell() {
        if (this.currentSpell === "fireball") this.updateSpellFireball();
    }

    updateSpellFireball() {
        //console.log("updateSpellFireball");
        let customData = this.mapHolder.fireball.customData;
        if (customData.active) {
            if (customData.exploding === false) {
                console.log("fireball moving...");
                game.physics.arcade.moveToXY(this.fireball, customData.targetXY.x, customData.targetXY.y, 150);
                if (( Math.abs(this.fireball.x - customData.targetXY.x) < 3) && (Math.abs(this.fireball.y - customData.targetXY.y) < 3)) {
                    // BAEM !!
                    this.mapHolder.fireball.customData.exploding = true;
                    this.mapHolder.fireball.body.velocity.x = 0;
                    this.mapHolder.fireball.body.velocity.y = 0;
                    this.mapHolder.fireball.animations.play('explode');
                    this.mapHolder.sndExplosion.play();
                    console.log("explode");
                }
            }
        }

    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // updateCallbacks:                             Logik:
    // initGame                                     MapHolder.createTerrain()
    // playerInputSelection                         PlayerInput.selectFriendlyUnit()
    // playerInputMove                              PlayerInput.moveUnit()
    // aiAction                                     AI.action()
    // aiMoveMonster                                AI.move_monster()
    // delay                                        Gameboard.delay()
    // playerLoses                                  Gameboard.playerLoses()
    // playerWins                                   Gameboard.playerWins
    //
    // one of them is constantly triggered in the update method of the gsGameboard GameState.
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    initGame() {
        this.mapHolder.createTerrain();
        this.mapHolder.createTowers();
        this.mapHolder.createTowns();
        this.mapHolder.normalizeTerrainAroundStructures();
        this.mapHolder.updateScoreText();
        this.updateCallback = this.playerInputSelection;
    }

    playerSelectSpellTarget() {
        this.mouseCursor.x = game.input.mousePointer.x;
        this.mouseCursor.y = game.input.mousePointer.y;


        if (this.escKey.isDown) {
            this.mouseDefaultCursorAnim.play();
            this.updateCallback = this.playerInputSelection; // back to default
        }

        switch(this.currentSpell) {

            case SPELL_TYPE.FIREBALL:
                console.log("type: fireball");
                if (this.currentSpell===SPELL_TYPE.FIREBALL) {
                    let response = this.playerInput.checkFireballCastClick();
                    if (response === GAMEBOARD_EVENT.SPELL_TARGET_SELECTED) {
                        this.mouseDefaultCursorAnim.play();
                        this.updateCallback = this.playerInputSelection; // back to default
                    }
                }
                break;
            case SPELL_TYPE.HEAL:
                console.log("type: heal");
                if (this.currentSpell===SPELL_TYPE.HEAL) {
                    let response = this.playerInput.checkHealCastClick();
                    if (response===GAMEBOARD_EVENT.SPELL_TARGET_SELECTED) {
                        this.mouseDefaultCursorAnim.play();
                        this.updateCallback = this.playerInputSelection; // back to default
                    }
                }
                break;
            case SPELL_TYPE.REFRESH:
                console.log("type: refresh");
                if (this.currentSpell===SPELL_TYPE.REFRESH) {
                    let response = this.playerInput.checkRefreshCastClick();
                    if (response===GAMEBOARD_EVENT.SPELL_TARGET_SELECTED) {
                        this.mouseDefaultCursorAnim.play();
                        this.updateCallback = this.playerInputSelection; // back to default
                    }
                }
                break;
        }
    }

    playerInputSelection() {
        this.mouseCursor.x = game.input.mousePointer.x;
        this.mouseCursor.y = game.input.mousePointer.y;

        this.updateCallback = this.playerInputSelection; // If triggered by an event.
        console.log("playerInputSelection");
        let response = this.playerInput.selectFriendlyUnit();
        if( response === "SET_MOVE") this.updateCallback = this.playerInputMove;
    }

    playerInputMove() {
        this.mouseCursor.x = game.input.mousePointer.x;
        this.mouseCursor.y = game.input.mousePointer.y;

        this.updateCallback = this.playerInputMove; // If triggered by an event.
        //console.log("playInputMove");
        let response = this.playerInput.moveUnit();

        if (response === "SET_INPUT") this.updateCallback = this.playerInputSelection;
        if (response === "DELAY_BEFORE_MOVE") {
            this.updateCallback= this.delay;
            game.time.events.add(Phaser.Timer.SECOND, this.playerInputMove, this);
        }
        if (response === "VICTORY") {
            console.log("Setting delay/playerWins");
            this.updateCallback=this.delay;
            game.time.events.add(Phaser.Timer.SECOND * 3, this.playerWins, this);
        }
    }

    delay() {
        this.mouseCursor.x = game.input.mousePointer.x;
        this.mouseCursor.y = game.input.mousePointer.y;

        console.log("DELAY");
        // Doing nothing, intentionally, this gets changed by an externally set Phase Timed Event.

    }


    aiAction() {
        this.mouseCursor.x = game.input.mousePointer.x;
        this.mouseCursor.y = game.input.mousePointer.y;

        this.mapHolder.applyNextTurnEffects();

        console.log("aiAction");
        this.ai.createMonster(highscoreManager.gamelevel, this.mapHolder.turn);
        this.updateCallback = this.delay;
        game.time.events.add(Phaser.Timer.SECOND, this.aiMoveMonster, this);
    }

    aiMoveMonster() {
        this.mouseCursor.x = game.input.mousePointer.x;
        this.mouseCursor.y = game.input.mousePointer.y;

        this.updateCallback=this.aiMoveMonster;

        console.log("aiMoveMonster");
        /* Select 1 creature turn, then exit to Delay */

        /* If selection was not possible, ap have been used up, and then
           prepare everything for the players' turn
*/
       this.mapHolder.refreshAp(FACTION.PLAYER);

       let result = this.ai.moveMonster();
       this.mapHolder.ftm.clearCache();

       this.updateCallback = this.delay;
       console.log("result="+result);
       if (result==="DONE") {
           this.btn_next_turn.alpha = 1;
           game.time.events.add(Phaser.Timer.SECOND *0.2, this.playerInputSelection, this);
       } else if (result==="DEFEAT") {
           game.time.events.add(Phaser.Timer.SECOND *3, this.playerLoses, this);
       }
       else {
           // stay with aiMoveMonster as Callback
           game.time.events.add(Phaser.Timer.SECOND *.2 , this.aiMoveMonster, this);

       }
    }



    playerLoses() {
        this.mouseCursor.x = game.input.mousePointer.x;
        this.mouseCursor.y = game.input.mousePointer.y;


        // Store values  HighscoreManager needs for score calculation
        this.mapHolder.storeScoreToHighscoreManager();
        game.state.start('Defeat');
    }


    playerWins() {
        this.mouseCursor.x = game.input.mousePointer.x;
        this.mouseCursor.y = game.input.mousePointer.y;

        console.log("Entering playerWins");
        // Store values  HighscoreManager needs for score calculation
        this.mapHolder.storeScoreToHighscoreManager();
        game.state.start("Victory");
    }

}
