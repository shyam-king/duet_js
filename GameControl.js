function GameControl(canvasid) {
    this.canvas = document.getElementById(canvasid);
    this.context = null;
    if (this.canvas.getContext) {
        this.context = this.canvas.getContext("2d");
    }
};

GameControl.prototype.init = function () {
    //initialize game
    console.log("Game begun")
};

GameControl.prototype.start = function() {
    if (this.context != null) {
        this.init();
        this.redraw();
    }
}

GameControl.prototype.redraw = function() {
    //should draw stuff here
}