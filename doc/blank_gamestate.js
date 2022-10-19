let gameStateName = {
    preload: function() {
        /* If you use our TextureAtlas system, load has to occur here. If images are already loaded they are taken
           from Phase.Cache automatically.
         */

        //game.load.atlasJSONHash('atlas', 'assets/tilesheets/tilesheet.png', 'assets/tilesheets/tilesheet_atlas.json');
    },
    create: function() {

        // Demo: How to add a sprite & make it react to MouseClicks.
        this.btn_ok = game.add.sprite(this.game.world.centerX, this.game.world.centerX, 'atlas', 'spr_ok_0');
        this.btn_ok.anchor.setTo(0.5, 0.5);

        this.btn_ok.inputEnabled=true;
        //let self=this;
        this.btn_ok.events.onInputDown.add( function() {

            game.state.start("mainScreen");
        });

    },
    update: function() {

    }
};