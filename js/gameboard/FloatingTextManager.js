class FloatingTextManager {

    constructor(floater_group) {
        this.floater_group = floater_group;

        this.lastCreationY=0;
    }

    addFloater(posx, posy, strText, colorCode='#ffffff', fontName='12px Arial') {
        this.origY=posy;
        this.str="Should set text "+strText+" to y="+posy+"   lastY="+this.lastCreationY;
        this.durationOffset=0
        if (this.lastCreationY>=posy) {
            posy=this.lastCreationY+12;
        }
        this.vanishOffset=(posy-this.origY);
        this.str+="   final y="+posy;


        this.myText = game.add.text(posx,posy, strText, {font: fontName, fill: colorCode});
        this.floater_group.add(this.myText);

        this.scrollUp = game.add.tween(this.myText);
        this.yval=-100-this.vanishOffset;
        this.speed=Math.abs(30 * this.yval); // 30 ms /Pixel

        console.log(this.str+"    speed="+this.speed);
        this.scrollUp.to({y:''+this.yval}, this.speed); // Float up 100+vo pixels over a duration of 3 seconds

        this.scrollUp.onComplete.add(function(sprite/*,event*/) {
            sprite.destroy();
        },this);
        this.scrollUp.start();
        this.lastCreationY = posy;
    }

    clearCache() {
        this.lastCreationY=0;
    }
}