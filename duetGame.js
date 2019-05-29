class DuetGame extends GameControl {
    redraw() {
        game.context.fillStyle = "rgb(255,255,255)";
        game.context.fillRect(0,0, game.canvas.width, game.canvas.height);

        if (GameSprite.loaded()) {
            obj_block.draw();
        } 
        else {
            //LOADING PAGE MAYBE   
            game.context.fillStyle = "rgb(0,0,0)";
            game.context.fillText("Loading assets...", 10, 10);
        }

        window.requestAnimationFrame(game.redraw);
    }

    init() {
        obj_block.position.x = 10;
        obj_block.position.y = 10;


        //INPUT HANDLING
        document.addEventListener("keydown", function(ev) {
            switch (ev.key) {
                case "ArrowDown":
                    obj_block.position.y += 1;
                    break;
                case "ArrowUp":
                    obj_block.position.y -= 1;
                    break;

                case "ArrowLeft":
                    obj_block.angle -= Math.PI/60;
                    break;

                case "ArrowRight":
                    obj_block.angle += Math.PI/60;
                    break;
                    
                default: 
                    console.log(ev.key);
            }
        });
    }

    update() {
    }
};

class ObjBlock extends GameObject {
    constructor (context) {
        super(context);

        this.image_speed = 0.5;
    }
};

var game = new DuetGame("gameDuet");
var spr_block = new GameSprite(32,32);
var obj_block = new ObjBlock(game.context);

obj_block.sprite.push(spr_block);

spr_block.addFrame("res/duet_sprite.png");
spr_block.addFrame("res/sprite1.png");

game.start();