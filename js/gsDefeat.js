// Display skull. Play lose sound. Click for Highscore GameState

let gsDefeat = {
    preload: function() {
        /* If you use our TextureAtlas system, load has to occur here. If images are already loaded they are taken
         from Phase.Cache automatically.
         */
        //game.load.atlasJSONHash('atlas', 'assets/tilesheets/tilesheet.png', 'assets/tilesheets/tilesheet_atlas.json');
        game.load.audio('lose','assets/sounds/snd_lose.wav');
    },
    create: function() {

        // Demo: How to addFloater a sprite & make it react to MouseClicks.
        this.skull = game.add.sprite(this.game.world.centerX, 0, 'atlas', 'spr_skull_0');
        this.skull.anchor.setTo(0.5, 0);


        this.scoretext = game.add.text(this.game.world.centerX-100,600,"Punktzahl: "+highscoreManager.getTotalScore(), { font: "16px Arial", fill: "#2ad3d4" });

        game.sound.stopAll();
        this.sndLose = game.add.audio('lose');
        this.sndLose.play();


        this.scorelabel=game.add.text(300,600,"Name:");
        this.textInput = new TextInput(400,630,'');



    },
    update: function() {
        this.textInput.updateCursorPosition();
        console.log(this.textInput.ENTER);
        if (this.textInput.ENTER) {
            let d = new Date();
            let day   = "0"+d.getDate();   day   = day.substr(day.length -2);
            let month = "0"+d.getMonth();  month = month.substr(month.length -2);
            let year  = "" +d.getFullYear();console.log("Year="+year);

            let germanDate = day+"."+month+"."+year;
            let playername=this.textInput.textValue.text; // TODO: URLENCODE

            let theUrl="http://www.zauberturm.de/games/necromancy/upload_score1.php?entry_name="+playername
                +"&entry_score="+highscoreManager.getTotalScore()+"&entry_date="+germanDate+"&level="
                +highscoreManager.gamelevel+"&checksum=11111";

            // As our save is fire & forget, we circumvent domain issues by putting the request
            // inside the source attribute of an HTML img element which we inject into the DOM
            // I feel a little bit dirty, but it works :-)
            document.getElementById("placeHolder").innerHTML = "<img src='"+theUrl+"'></img>";

            highscoreManager.gamelevel=1;
            game.state.start("Title");
        }
    }
};
