class AI {
    constructor(_mapHolder) {
        this.mapHolder = _mapHolder;
    }


    createMonster(gamelevel, turn) {
        // Select & create monster army

        let lvlMod=gamelevel-1;
        let turn_inc=5;

        let chance_banshee_prc  = Math.max(Math.floor(turn/turn_inc) * 3+lvlMod*3, 10+lvlMod*10);
        let chance_ghoul_prc    = Math.max(Math.floor(turn/turn_inc)*5+lvlMod*3, 20+lvlMod*10);
        let chance_skeleton_prc = Math.max(75-(Math.floor(turn/turn_inc)*5+lvlMod*3),30+lvlMod*10);
        console.log("Chances: "+chance_skeleton_prc+"/"+chance_ghoul_prc+"/"+chance_banshee_prc);
        let roll = rollDice(100);

        let army_type = ARMY_TYPE.NONE;
        if ( roll > 100-chance_banshee_prc )     {
            console.log("Select type Banshee");
            army_type=ARMY_TYPE.BANSHEE;
        } else if ( roll > 100-chance_ghoul_prc )  {
            console.log("Select type Ghoul");
            army_type=ARMY_TYPE.GHOUL;
        } else if (roll > 100-chance_skeleton_prc) {
            console.log("Select type Skeleton");
            army_type=ARMY_TYPE.SKELETON;
        }
        else {
            console.log("No monster created");
        }

        if (army_type!==ARMY_TYPE.NONE) {
            let pos = this.mapHolder.getRandomLocationNear(this.mapHolder.enemyTower);
            this.mapHolder.createArmyUnit(army_type,pos.boardX, pos.boardY);
        }


    }


    // Move the first monster that happens to have ap
    moveMonster() {

        let army=this.mapHolder.getActionableMonster();
        if (!army) {

            return "DONE";
        } // There arent any more monsters to move.



        switch (army.armytype) {
            case ARMY_TYPE.SKELETON:
                this.moveSkeleton(army);
                break;
            case ARMY_TYPE.GHOUL:
                this.moveGhoul(army);
                break;
            case ARMY_TYPE.BANSHEE:
                this.moveBanshee(army);
                break;
        }

        if (!this.mapHolder.armyTypeExists(ARMY_TYPE.PLAYER_TOWER))  {

            return "DEFEAT";
        }

        return "STEP_COMPLETE" // We have moved 1 monster.
    }

    moveSkeleton(army) {
        // Goal Priorities:    1.) Attack Player Army or town if adjacent
        //                     2.) Mmove towards Player tower
        if (army.ap<1) return;

        let self=this;

        /////////

        let getPositionValue4skeleton = function (boardX, boardY) {
            // For skeletons: Lower(better) value the nearer to Players' Tower
            // if x-ordinate is bigger, give it a lower (better) value and vice versa.
            let distanceValue = self.mapHolder.getDistance(self.mapHolder.playerTower, boardX, boardY) * 100;
            let ordinateValue = Math.max(  Math.abs(boardX-self.mapHolder.playerTower.boardX), Math.abs(boardY-self.mapHolder.playerTower.boardY));
            return distanceValue + ordinateValue;
        };


        let selectSkeletonMoveOption = function(army){
            let moveOptions= [];

            if (!self.mapHolder.isOccupied(army.boardX-1,army.boardY)) { moveOptions.push({boardX:army.boardX-1, boardY:army.boardY,   value:getPositionValue4skeleton(army.boardX-1,army.boardY  )}); }
            if (!self.mapHolder.isOccupied(army.boardX+1,army.boardY)) { moveOptions.push({boardX:army.boardX+1, boardY:army.boardY,   value:getPositionValue4skeleton(army.boardX+1,army.boardY  )}); }
            if (!self.mapHolder.isOccupied(army.boardX,army.boardY+1)) { moveOptions.push({boardX:army.boardX  , boardY:army.boardY+1, value:getPositionValue4skeleton(army.boardX  ,army.boardY+1)}); }
            if (!self.mapHolder.isOccupied(army.boardX,army.boardY-1)) { moveOptions.push({boardX:army.boardX  , boardY:army.boardY-1, value:getPositionValue4skeleton(army.boardX  ,army.boardY-1)}); }

            if (moveOptions.length===0) { return null;}

            let sortFunc=function(a,b) {
                let comparison=0;
                if (a.value > b.value) { comparison = 1; }
                if (a.value < b.value) { comparison = -1; }
                return comparison
            };

            moveOptions.sort(sortFunc);
            return { boardX: moveOptions[0].boardX, boardY: moveOptions[0].boardY };
        };

        let target=this.mapHolder.getAdjacentOpponentTo(army);
        if (target) {
            this.mapHolder.attackArmy(army, target); // Inconsisteny: attackArmy deducts ap, but movement ap get deducted in this method.
        } else {
            let moveTarget = selectSkeletonMoveOption(army);
            if (!moveTarget) { return }
            army.ap-=1;// Inconsisteny: attackArmy deducts ap, but movement ap get deducted in this method.
            army.boardX = moveTarget.boardX;
            army.sprite.x=this.mapHolder.mapToScreen(army.boardX);
            army.boardY = moveTarget.boardY;
            army.sprite.y=this.mapHolder.mapToScreen(army.boardY);
            this.mapHolder.sndMove.play();
        }
    }

    moveGhoul(army){
        // Goal Priorities:    1.) Attack Player Army or town if adjacent
        //                     2.) Move towards town
        //                     3.) Move towards player tower
        if (army.ap<1) return;
        let self=this;

        let getPositionValue4Ghoul = function (boardX, boardY) {
            // For ghouls: Lower(better) value for the nearest town
            // if x-ordinate is bigger, give it a lower (better) value and vice versa.

            let town = self.mapHolder.getNearestTownTo(boardX, boardY);
            town = town || self.mapHolder.playerTower;

            let distanceValue = self.mapHolder.getDistance(town, boardX, boardY) * 100;
            let ordinateValue = Math.max(  Math.abs(boardX - town.boardX), Math.abs(boardY - town.boardY));
            return distanceValue + ordinateValue;
        };


        let selectGhoulMoveOption = function(army){
            let moveOptions = [];

            if (!self.mapHolder.isOccupied(army.boardX-1,army.boardY)) { moveOptions.push({boardX:army.boardX-1, boardY:army.boardY,   value:getPositionValue4Ghoul(army.boardX-1,army.boardY  )}); }
            if (!self.mapHolder.isOccupied(army.boardX+1,army.boardY)) { moveOptions.push({boardX:army.boardX+1, boardY:army.boardY,   value:getPositionValue4Ghoul(army.boardX+1,army.boardY  )}); }
            if (!self.mapHolder.isOccupied(army.boardX,army.boardY+1)) { moveOptions.push({boardX:army.boardX  , boardY:army.boardY+1, value:getPositionValue4Ghoul(army.boardX  ,army.boardY+1)}); }
            if (!self.mapHolder.isOccupied(army.boardX,army.boardY-1)) { moveOptions.push({boardX:army.boardX  , boardY:army.boardY-1, value:getPositionValue4Ghoul(army.boardX  ,army.boardY-1)}); }

            if (moveOptions.length===0) { return null;}

            let sortFunc=function(a,b) {
                let comparison=0;
                if (a.value > b.value) { comparison = 1; }
                if (a.value < b.value) { comparison = -1; }
                return comparison
            };

            moveOptions.sort(sortFunc);
            return { boardX: moveOptions[0].boardX, boardY: moveOptions[0].boardY };
        };

        ////////////////////////////

        let target=this.mapHolder.getAdjacentOpponentTo(army);
        if (target) {
            this.mapHolder.attackArmy(army, target); // Inconsisteny: attackArmy deducts ap, but movement ap get deducted in this method.
        } else {
            let moveTarget = selectGhoulMoveOption(army);
            if (!moveTarget) { return }
            army.ap-=1;                 // Inconsisteny: attackArmy deducts ap, but movement ap get deducted in this method.
            army.boardX = moveTarget.boardX;
            army.sprite.x=this.mapHolder.mapToScreen(army.boardX);
            army.boardY = moveTarget.boardY;
            army.sprite.y=this.mapHolder.mapToScreen(army.boardY);
            this.mapHolder.sndMove.play();
        }
    }

    moveBanshee(army){
        // Goal Priorities:    1.) Attack Player Army or town if adjacent
        //                     2.) Move towards next (mobile) player army
        //                     3.) Move towards player tower
        if (army.ap<1) return;
        let self=this;

        let getPositionValue4Banshee = function (boardX, boardY) {
            // For Banshees: Lower(better) value for the nearest player army
            // if x-ordinate is bigger, give it a lower (better) value and vice versa.

            let army = self.mapHolder.getNearestPlayerArmyTo(boardX, boardY);

            army = army || self.mapHolder.playerTower;

            let distanceValue = self.mapHolder.getDistance(army, boardX, boardY) * 100;
            let ordinateValue = Math.max(  Math.abs(boardX - army.boardX), Math.abs(boardY - army.boardY));
            return distanceValue + ordinateValue;
        };


        let selectBansheeMoveOption = function(army){
            let moveOptions= [];

            if (!self.mapHolder.isOccupied(army.boardX-1,army.boardY)) { moveOptions.push({boardX:army.boardX-1, boardY:army.boardY,   value:getPositionValue4Banshee(army.boardX-1,army.boardY  )}); }
            if (!self.mapHolder.isOccupied(army.boardX+1,army.boardY)) { moveOptions.push({boardX:army.boardX+1, boardY:army.boardY,   value:getPositionValue4Banshee(army.boardX+1,army.boardY  )}); }
            if (!self.mapHolder.isOccupied(army.boardX,army.boardY+1)) { moveOptions.push({boardX:army.boardX  , boardY:army.boardY+1, value:getPositionValue4Banshee(army.boardX  ,army.boardY+1)}); }
            if (!self.mapHolder.isOccupied(army.boardX,army.boardY-1)) { moveOptions.push({boardX:army.boardX  , boardY:army.boardY-1, value:getPositionValue4Banshee(army.boardX  ,army.boardY-1)}); }

            console.log("MoveOptions");
            for (let ii=0;ii<moveOptions.length;ii++) { console.log (moveOptions[ii]); }
            if (moveOptions.length===0) { return null;}

            let sortFunc=function(a,b) {
                let comparison=0;
                if (a.value > b.value) { comparison = 1; }
                if (a.value < b.value) { comparison = -1; }
                return comparison
            };

            moveOptions.sort(sortFunc);
            return { boardX: moveOptions[0].boardX, boardY: moveOptions[0].boardY };
        };


        ////////////////

        let target=this.mapHolder.getAdjacentOpponentTo(army);
        if (target) {
            this.mapHolder.attackArmy(army, target);// Inconsisteny: attackArmy deducts ap, but movement ap get deducted in this method.
        } else {
            let moveTarget = selectBansheeMoveOption(army);
            if (!moveTarget) { return }
            army.ap-=1;// Inconsisteny: attackArmy deducts ap, but movement ap get deducted in this method.
            army.boardX = moveTarget.boardX;
            army.sprite.x=this.mapHolder.mapToScreen(army.boardX);
            army.boardY = moveTarget.boardY;
            army.sprite.y=this.mapHolder.mapToScreen(army.boardY);
            this.mapHolder.sndMove.play();
        }

    }

}