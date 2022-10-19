class HighscoreManager {
    constructor() {
        this.text = "";
        this.lastLoadTime = 0; // nothing loaded yet


        // Values for score calculation.
        this.gamelevel = 1; // Has to be stored here, since HighscoreManager is the only object persisting over the Phase Gamestates
        this.armies=[];
        this.gold=0;
        this.mana=0;
        this.towns=0;
        this.turn=0;

    }

    getOnlineHighscores() {

        let xhr = new XMLHttpRequest();
        xhr.open("GET", "/games/necromancy/get_highscore.php", true);

        // TODO: in case of 404 this.text is filled with error message - why?

        let self = this;
        xhr.onload = function () {
            self.text = xhr.responseText;
            self.lastLoadTime = new Date().getTime(); // get number of milliseconds since 1970/01/01
            // console.log('Response from CORS request to "' + self.text + '"');
        };

        xhr.onerror = function () {
            console.log('Woops, there was an error making the request.')
        };

        xhr.send();
    }

    saveHighscore(playerName, germanDate) {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "http://www.zauberturm.de/games/necromancy/upload_score1.php", true);

        let self = this;
        xhr.onload = function () {
            self.text = xhr.responseText;
            self.lastLoadTime = new Date().getTime(); // get number of milliseconds since 1970/01/01
            console.log('Response from CORS request to "' + self.text + '"');
        };

        xhr.onerror = function () {
            console.log('Woops, there was an error making the request.')
        };

        xhr.send();
    }


    getTotalScore() {
        return this.getTownScore()+this.getManaScore()+this.getGoldScore()+this.getTurnScore()+this.getUnitScore()+this.getLevelScore();
    }

    getTownScore(){
        return this.towns * 150;
    }
    getManaScore(){
        return Math.min(this.mana,150);
    }
    getGoldScore(){
        return Math.min(this.gold,150);
    }
    getTurnScore(){
        return Math.max(0, 505-this.turn*5);
    }
    getUnitScore(){
        let score=0;
        for (let i=0; i<this.armies.length; i++) {
            if (this.armies[i].faction==FACTION.PLAYER && !this.armies[i].is_structure) {
                score += this.armies[i].getScore();
            }
        }
        return score;
    }
    getLevelScore(){
        return (highscoreManager.gamelevel-1) * 500; // HighscoreManager is a global variable, accessible from anywhere, like game.
    }

    storeScoreToHighscoreManager(){
        highscoreManager.armies = this.getPlayerArmies();
        highscoreManager.gold   = this.gold;
        highscoreManager.mana   = this.mana;
        highscoreManager.towns  = this.getTownCount();
        highscoreManager.turn   = this.turn;
    }


}
