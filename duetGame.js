var game = new GameControl("gameDuet");

game.redraw = function() {
    this.context.fillStyle = "rgba(255,255,255,1)";
    this.context.fillRect(0,0,300,400);

    this.context.fillStyle = "rgb(0,0,0)";
    this.context.beginPath();
    this.context.arc(150,200,50,0,Math.PI * 2, false);
    this.context.stroke();
}

game.start();