"use strict";

// These vars are global
let game = new Phaser.Game(1024, 768, Phaser.CANVAS, 'Necromancy V2.0');
let highscoreManager = new HighscoreManager();

//document.getElementById('canvas_div_no_cursor').style.cursor = "none";

game.state.add('Title',gsTitle);
game.state.add('Gameboard',gsGameboard);
game.state.add('Defeat',gsDefeat);
game.state.add('Victory',gsVictory);
game.state.add('Highscore',gsHighscore);
game.state.start('Title');
//game.state.start('Defeat');
