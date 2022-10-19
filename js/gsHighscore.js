// Display Highscore. If highscoreManager contains a recent game value, center on the new entries' position.
// Click to remain to titleScreen

let gsHighscore = {
    preload: function () {
    },
    create: function () {

        this.btn_main_menu = game.add.sprite(this.game.world.centerX, 500, 'atlas', 'spr_main_menu_0');
        this.btn_main_menu.anchor.setTo(0.5, 0.5);
        this.btn_main_menu.inputEnabled = true;
        this.btn_main_menu.events.onInputDown.add(function () {
            game.state.start("Title");
        });

        this.column1 = game.add.text(200, 160, ".", {font: "12px Arial", fill: "#cfd41d"});
        this.column2 = game.add.text(250, 160, '.', {font: "12px Arial", fill: "#cfd41d"});
        this.column3 = game.add.text(300, 160, '.', {font: "12px Arial", fill: "#cfd41d"});
        this.column4 = game.add.text(500, 160, '.', {font: "12px Arial", fill: "#cfd41d"});
        this.column5 = game.add.text(600, 160, '.', {font: "12px Arial", fill: "#cfd41d"});
        this.text1 = game.add.text(300, 400, '.', {font: "12px Arial", fill: "#cfd41d"});

        highscoreManager.getOnlineHighscores();
        this.mouseCursor = game.add.sprite(game.input.mousePointer.x,game.input.mousePointer.y,'atlas','spr_mouse_0');

    },
    lastLoadTime: 0,
    update: function () {
        this.mouseCursor.x = game.input.mousePointer.x;
        this.mouseCursor.y = game.input.mousePointer.y;

        if (this.lastLoadTime !== highscoreManager.lastLoadTime) {

            let text = highscoreManager.text.replace(/&sect;/g, "§").trim();
            //console.log("update:" + text);
            let list = text.trim().split("§");

            this.column1.text = "";
            this.column2.text = "";
            this.column3.text = "";
            this.column4.text = "";
            this.column5.text = "";
            this.text1.text = `Es wurden ${list.length} siegreiche Schlachten geschlagen.`;

            for (let i = 0; i < Math.min(10, list.length); i++) {
                try {
                    let values = list[i].split(";");
                    this.column1.text += (i + 1) + "\n";
                    this.column2.text += values[0] + "\n";
                    this.column3.text += values[1] + "\n";
                    this.column4.text += values[2] + "\n";
                    this.column5.text += values[3] + "\n";
                } catch (err) {
                    console.log(err.message);
                }
            }
        }
    }
};