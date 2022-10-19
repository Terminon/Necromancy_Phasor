class TextInput {

    constructor(x,y,label,startText,fontSize=18) {
        self = this;
        this.strFontSize=""+fontSize;
        this.label = game.add.text(x, y, "Name:", {font: this.strFontSize+"px Arial", fill: "#cfd41d"});
        this.textValue = game.add.text(x+this.label.width, y, startText, {font: this.strFontSize+"px Arial", fill: "#cfd41d"});
        this.textValue.inputEnabled=true;

        this.bmd = game.add.bitmapData(4,fontSize-2);
        this.bmd.ctx.beginPath();
        this.bmd.ctx.rect(0, 0, 4, fontSize-2);
        this.bmd.ctx.fillStyle = '#eeee00';
        this.bmd.ctx.fill();
        this.textValue.cursor = game.add.sprite(x+this.label.width+this.textValue.width,y+3,this.bmd);

        //this.cursor.inputEnabled=true;

        // addCallbacks(context, onDown, onUp, onPress)
        game.input.keyboard.addCallbacks( this.textValue, null,this.myKeyDownHandler,null );

        // This function computes the ascii for the key if it's an upper- or lower-case letter.

        this.ENTER = false;
    }

    updateCursorPosition() {
        this.textValue.cursor.x=this.textValue.x + this.textValue.width;
    }

    myKeyDownHandler(evt) {
        let DELETE = 8;
        let RETURN = 13;
        let A_CHAR = 65;
        let Z_CHAR = 90;
        let ZERO_CHAR = 48;
        let NINE_CHAR = 57;
        let SPACE = 32;

        let val = evt.which;
        //console.log(val);
        if (val>Z_CHAR) return;
        else if (val<A_CHAR && val >NINE_CHAR) return;
        else if ((val < ZERO_CHAR) && (val!== DELETE && val !== RETURN) && val !==SPACE ) return;


        //console.log(""+"0".charCodeAt(0)+"    "+"9".charCodeAt(0)+"         "+evt.which);

        if (evt.which === RETURN) {
            this.cursor.visible=false;
            self.ENTER = true;
            return;
        }

        this.cursor.visible=true;
        if (evt.which === DELETE){

            if (this.text.length>0) {
                let before = this.text;
                this.text = this.text.slice(0,-1); // Remove lastcharacter
                //console.log("Before: '"+before+"', after: '"+this.text+"'    "+evt.which);
                self.updateCursorPosition();
                return;
            }
        }

        let letter = String.fromCharCode( evt.which );
        if( !evt.shiftKey ) letter = letter.toLowerCase();
        this.text+=letter;
        self.updateCursorPosition();
        //console.log(evt.which);
    }

}