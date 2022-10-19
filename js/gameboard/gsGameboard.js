// The game happens here.
// Has its own state, which decides, what to draw, and on what to react.
// Suggestion: Calling this variable gameBoardMode. See also directory gameboard/modes containing them.
let gsGameboard = {
    preload: function() {
        game.load.atlasJSONHash('atlas', 'assets/tilesheets/tilesheet.png', 'assets/tilesheets/tilesheet_atlas.json');
        game.load.audio('hit','assets/sounds/snd_hit_damage.wav');
        game.load.audio('miss','assets/sounds/snd_miss.wav');
        game.load.audio('monsterDeath','assets/sounds/snd_monster_army_death.wav');
        game.load.audio('armyDeath','assets/sounds/snd_human_army_death.wav');
        game.load.audio('townCaptured','assets/sounds/snd_town_captured.wav');
        game.load.audio('moveUnit','assets/sounds/snd_move.wav');
        game.load.audio('structureDestroyed','assets/sounds/snd_structure_destroyed.wav');
        game.load.audio('drain','assets/sounds/snd_drain.wav');
        game.load.audio('launch','assets/sounds/snd_fireball_launch.wav');
        game.load.audio('explosion','assets/sounds/snd_fireball_explosion.wav');
        game.load.audio('heal','assets/sounds/snd_heal.wav');
        game.load.audio('refresh','assets/sounds/snd_refresh.wav');
    },
    create: function() {

        this.gameboard = new Gameboard(this.mouseCursor); // constructor sets Gameboard.updateCallback to Gameboard.initGame(), so its safe for update function.



        // this.btn_ok = game.addFloater.sprite(this.game.world.centerX, this.game.world.centerX, 'atlas', 'spr_ok_0');
        // this.btn_ok.anchor.setTo(0.5, 0.5);
        //
        // this.btn_ok.inputEnabled=true;
        // var self=this;
        // this.btn_ok.events.onInputDown.addFloater( function() {
        //
        //     this.game.state.start("title");
        // });

    },
    update: function() {

        this.gameboard.updateCallback(); // Run current Gameboard.updateCallback

        this.gameboard.mapHolder.updateTerrainInfo(game.input.activePointer.position.x, game.input.activePointer.position.y);
        this.gameboard.mapHolder.updateUnitTooltip(game.input.activePointer.position.x, game.input.activePointer.position.y);
        this.gameboard.mapHolder.updateScoreText();
        this.gameboard.updateSpell();
    }
};
