class DuetGame extends GameControl {
    redraw() {
        game.context.fillStyle = "rgb(255,255,255)";
        game.context.fillRect(0,0, 300, 400);

        if (GameSprite.loaded()) {
            obj_block.draw();
        } 
        else {
            game.context.fillStyle = "rgb(0,0,0)";
            game.context.fillText("Loading assets...", 10, 10);
        }
    }

    init() {
        obj_block.position.x = 10;
        obj_block.position.y = 10;
    }
};

class ObjBlock extends GameObject {

};

var game = new DuetGame("gameDuet");
var spr_block = new GameSprite();
var obj_block = new ObjBlock(game.context);

obj_block.sprite.push(spr_block);

spr_block.addFrame("res/duet_sprite.png");

game.start();