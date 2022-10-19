// Display victory image. Play victory sound.
// Display victory values. Input Player Name. Store to Web, and retrieve current
// Highscore List in return.

let gsVictory = {
    preload: function() {
        game.load.audio('win','assets/sounds/snd_win.wav');
    },
    create: function() {

        this.victory = game.add.sprite(this.game.world.centerX,0, 'atlas', 'spr_victory');
        this.victory.anchor.setTo(0.5,0)

        this.theScore = game.add.text(this.game.world.centerX,700,"Spielwert:"+highscoreManager.getTotalScore(), { font: "16px Arial", fill: "#2ad3d4" });
        this.theScore.anchor.setTo(.5,0)

        this.btn_ok = game.add.sprite(this.game.world.centerX, 750, 'atlas', 'spr_ok_0');
        this.btn_ok.anchor.setTo(0.5, 0.5);

        game.sound.stopAll();
        this.sndLose = game.add.audio('win');
        this.sndLose.play();




        this.btn_ok.inputEnabled=true;
        // let self=this;
        this.btn_ok.events.onInputDown.add( function() {
            highscoreManager.gamelevel+=1;
            game.state.start("Gameboard");
        });

        this.mouseCursor = game.add.sprite(game.input.mousePointer.x,game.input.mousePointer.y,'atlas','spr_mouse_0');


    },
    update: function() {
        this.mouseCursor.x = game.input.mousePointer.x;
        this.mouseCursor.y = game.input.mousePointer.y;
    }
};
