class ScrollTextManager {
    constructor (_game, _back_group) {
        
        let text = "IDEE UND PROGRAMMIERUNG:Jörg Alexander:Torsten Schneider::" +
            "MUSIK:Imphenzia::" +
            "TESTING UND FEEDBACK:Michaela K.:Marco S.:Udo P.:Christoph H. (a.k.a. Sage)::" +
            "Lose basiert auf einer fast:wahren Begebenheit aus einer:PnP Rollenspielrunde...:::" +
            "Noch Ideen ? Einfach an:magus@zauberturm.de mailen.::::::::::" +
            "Wer das hier liest, hat zuviel Zeit ;-)::::::::::::::::::";
        this.index = 0;    
        this.lines = text.split(":");

        this.game = _game;
        this.back_group = _back_group;

        game.time.events.loop(Phaser.Timer.SECOND, this.createLine, this);
        this.createLine();
    }

    createLine() {
        let line = this.lines[this.index++];
        this.index = this.index % this.lines.length; // MODULO, back to 0

        this.myLine = this.game.add.text(this.game.world.centerX,900,line, { font: "16px Arial", fill: "#2ad3d4" });
        this.myLine.anchor.setTo(0.5,0);
        this.back_group.add(this.myLine);

        this.scrollUp = this.game.add.tween(this.myLine);
        this.scrollUp.to({y:'-450'}, 25000);

        this.scrollUp.onComplete.add(function(sprite/*,event*/) {
            sprite.destroy();
        },this);
        this.scrollUp.start();
    }



}