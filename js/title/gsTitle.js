let gsTitle = {
    preload: function() {
        game.load.atlasJSONHash('atlas', 'assets/tilesheets/tilesheet.png', 'assets/tilesheets/tilesheet_atlas.json');
        game.load.audio('click','assets/sounds/snd_click.mp3');
        game.load.audio('maintitle','assets/sounds/snd_maintheme_this_is_war.mp3')

    },
    create: function() {
        document.getElementById("placeHolder").innerHTML = "<img src=''></img>";

        this.sndClick = game.add.audio('click');
        this.titlemusic = game.add.audio('maintitle');
        this.titlemusic.play();



        this.maintitle = game.add.sprite(this.game.world.centerX, 0, 'atlas', 'spr_title_0');
        this.maintitle.anchor.setTo(0.5, 0);

        this.back_group = game.add.group();
        this.front_group = game.add.group();



        // draw blocking shape
        this.blockingsprite = game.add.graphics(0, 0);
        this.front_group.add(this.blockingsprite);

        this.blockingsprite.beginFill(0x000000);
        this.blockingsprite.moveTo(0, 400);
        this.blockingsprite.lineTo(this.game.world.width, 400);
        this.blockingsprite.lineTo(this.game.world.width, 500);
        this.blockingsprite.lineTo(0, 500);
        this.blockingsprite.lineTo(0, 400);


        for (let i = 1; i < 20; i += 1) {

            this.blockingsprite.moveTo(0, 500+i*3);
            this.blockingsprite.lineTo(this.game.world.width, 500+i*3);
            this.blockingsprite.lineTo(this.game.world.width, 500+i*3+1);
            this.blockingsprite.lineTo(0,  500+i*3+1);
            this.blockingsprite.lineTo(0, 500+i*3);


            if (i<12) {
               let x_off = i % 2;
                for (let j = 0; j < this.game.world.width; j += 4) {
                    this.blockingsprite.moveTo(j  +x_off, 496 + i * 3+2);
                    this.blockingsprite.lineTo(j+3+x_off, 496 + i * 3+2);
                    this.blockingsprite.lineTo(j+3+x_off, 496 + i * 3+2+2);
                    this.blockingsprite.lineTo(j  +x_off, 496 + i * 3+2+2);
                    this.blockingsprite.lineTo(j  +x_off, 496 + i * 3+2);
                }
            }
        }

        this.blockingsprite.endFill();

        new ScrollTextManager(game, this.back_group);

        this.startbtn = this.game.add.sprite(this.game.world.centerX, 340, 'atlas', 'spr_start_game_0');
        this.startbtn.anchor.setTo(.5,.5);
        this.startbtn.inputEnabled=true;
        let self=this;
        this.startbtn.events.onInputDown.add( function() {
            self.titlemusic.stop();
            self.sndClick.play();
            game.state.start("Gameboard");
        });

        this.highscoreButton = game.add.sprite(this.game.world.centerX, 410, 'atlas', 'spr_highscore_btn_0');
        this.highscoreButton.anchor.setTo(0.5,0.5);
        this.highscoreButton.inputEnabled=true;
        this.highscoreButton.events.onInputDown.add( function() {
            self.sndClick.play();
            game.state.start("Highscore");
        });

        this.mouseCursor = game.add.sprite(game.input.mousePointer.x,game.input.mousePointer.y,'atlas','spr_mouse_0');


    },
    update: function() {
        this.mouseCursor.x = game.input.mousePointer.x;
        this.mouseCursor.y = game.input.mousePointer.y;
    }
};
