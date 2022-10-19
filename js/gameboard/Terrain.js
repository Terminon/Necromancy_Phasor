class Terrain {
    constructor(_name,_move_cost,_move_damage,_rest_gain,_def_bonus, _imagename) {
        this.name = _name;
        this.move_cost = _move_cost;
        this.move_damage = _move_damage;
        this.rest_gain = _rest_gain;
        this.def_bonus = _def_bonus;
        this.imagename = _imagename;
    }

    getValueDisplayString() {
        return "\n"
            +this.move_cost+"\n"
            +this.move_damage+"\n"
            +this.rest_gain+"\n"
            +this.def_bonus+"\n";

    }
    getFieldDisplayString() {
        return this.name+"\nBewegungskosten:\nBewegungsschaden:\nRast-Heilung:\nVert.Bonus:";
    }
}
