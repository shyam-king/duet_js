//misc
var username_field = document.getElementById("username");
var nameSubmit_button = document.getElementById("nameSubmitButton");
var canPlay = false;
var username = "";
var scorecard_table = document.getElementById("scorecard");

nameSubmit_button.onclick = function() {
    if (username_field.value != "") {
        canPlay = true;
        username =  username_field.value;
        username_field.value = "";
    }
};

//LOAD SPRITES
var spr_rishav = new GameSprite(8,8);
spr_rishav.addFrame("res/rishav.png");
var spr_phoebe = new GameSprite(8,8);
spr_phoebe.addFrame("res/phoebe.png");
var spr_arrow_right = new GameSprite(32,32);
spr_arrow_right.addFrame("res/arrow_right.png");
var spr_background = new GameSprite();
spr_background.addFrame("res/bg.png");
var spr_obstacle_horiz = new GameSprite(50, 12.5);
spr_obstacle_horiz.addFrame("res/obstacle_horizontal.png");
var spr_obstacle_vert = new GameSprite(12.5, 50);
spr_obstacle_vert.addFrame("res/obstacle_vertical.png");
var spr_play_button = new GameSprite(32,32);
spr_play_button.addFrame("res/arrow_right.png"); // normal
spr_play_button.addFrame("res/arrow_right.png"); // hover 
spr_play_button.addFrame("res/arrow_right.png"); // clicked

//game-specific global vars
var time; 
var score; //time in seconds

//intro screen
class IntroGameScreen extends GameControl {
    init() {
        obj_play_button.image_speed = 0;
        obj_play_button.image_index = 0;
        obj_play_button.sprite.push(spr_play_button);
        obj_play_button.position = {
            x: this.canvas.width/2,
            y: this.canvas.height/2 + 20
        };

        //INPUT HANDLING
        introGameScreen.canvas.addEventListener("mousemove", function(ev){
            var rect = introGameScreen.canvas.getBoundingClientRect();
            var x = ev.clientX - rect.x;
            var y = ev.clientY - rect.y;

            if (canPlay) {
                if (obj_play_button.inBox(x,y)) {
                    obj_play_button.angle = Math.PI/6;
                    console.log("HIT");
                }
                else {
                    obj_play_button.angle = 0;
                    console.log("NOHIT");
                }
            }

            console.log("(" + x +", " + y + ")");
        });

    }

    update() {
        if (!canPlay) {
            obj_play_button.angle = -Math.PI/2;
        }
    }

    redraw() {
        var ctx = introGameScreen.context;
        var canv = introGameScreen.canvas;

        if(GameSprite.loaded()) {
            obj_bg.draw();
            obj_play_button.draw();

            ctx.save();
            var x = canv.width/2 - ctx.measureText(username).width/2;
            ctx.fillStyle = "rgba(255,255,255,1)";
            ctx.fillText(username, x, canv.height/2 - 40);
            ctx.restore();
        }
        else {
            ctx.save();
            
            ctx.fillStyle = "rgb(255,255,255)";
            ctx.fillRect(0, 0, introGameScreen.canvas.width, introGameScreen.canvas.height);
            
            ctx.fillStyle = "rgb(0,0,0)";
            ctx.fillText("Loading assets...", 10, 10);

            ctx.restore();
        }
        window.requestAnimationFrame(introGameScreen.redraw);
    }
}
var introGameScreen = new IntroGameScreen("gameDuet");

// Main Gameplay Screen
class DuetGameScreen extends GameControl {
    redraw() {
        obj_bg.draw();
        obstacleDrawControl();
        obj_player.draw();
        obj_arrow_left.draw();
        obj_arrow_right.draw();

        obj_hud.draw();
    
        window.requestAnimationFrame(duetGameScreen.redraw);
    }

    init() {
        console.log("game init");
        //object(s) initializations
        obj_arrow_right.sprite.push(spr_arrow_right);
        obj_arrow_left.sprite.push(spr_arrow_right);
        obj_arrow_left.image_scale.x = -1;

        obj_arrow_left.position.y = this.canvas.height - 60;
        obj_arrow_right.position.y = this.canvas.height - 60;
        obj_arrow_left.position.x = 50;
        obj_arrow_right.position.x = this.canvas.width - 50;

        //game var initializations
        time = 0;
        score = 0;
        ObjObstacle.obstacleSpeed = 2;
        ObjObstacle.spawned = [];
        ObjObstacle.obstacleSpawning = 0;

        //INPUT HANDLING
        document.addEventListener("keydown", function(ev) {
            switch (ev.key) {
                case "ArrowDown":
                    
                    break;
                case "ArrowUp":
                    
                    break;

                case "ArrowLeft":
                    obj_player.left();
                    break;

                case "ArrowRight":
                    obj_player.right();
                    break;

                default: 
                    console.log(ev.key);
            }
        });

        duetGameScreen.canvas.addEventListener("mousedown", function(ev){
            var rect = duetGameScreen.canvas.getBoundingClientRect();
            var x = ev.clientX - rect.x;
            var y = ev.clientY - rect.y;

            //do something
            if (x >= 0 && x <= duetGameScreen.canvas.width && y >= 0 && y <= duetGameScreen.canvas.height) {
                if (obj_arrow_left.inBox(x,y)) {
                    obj_player.left();
                }
                else if (obj_arrow_right.inBox(x,y)) {
                    obj_player.right();
                }
            }

        });
    }

    update() {
        obj_player.update();
        obstacleSpawnControl();

        time += 1;
        score = Math.floor(time / 60);
    }
};

var duetGameScreen = new DuetGameScreen("gameDuet");

//Game objects
var obj_rishav = new GameObject(duetGameScreen.context);
var obj_phoebe = new GameObject(duetGameScreen.context);
var obj_bg = new GameObject(duetGameScreen.context);
obj_bg.sprite.push(spr_background);

//player object
class ObjPlayer extends GameObject {
    constructor (context) {
        super(context);
        obj_rishav.sprite.push(spr_rishav);
        obj_phoebe.sprite.push(spr_phoebe);
        this.position.x = duetGameScreen.canvas.width / 2;
        this.position.y = duetGameScreen.canvas.height - 60;

        this.radius = 50;
        this.speed = Math.PI/45;
        this.angleSpeed = this.speed;
    }

    left() {
        this.angleSpeed = -this.speed;
    }

    right () {
        this.angleSpeed = this.speed;
    }

    update() {
        obj_rishav.position.x = this.position.x + this.radius * Math.cos(this.angle);
        obj_rishav.position.y = this.position.y + this.radius * Math.sin(this.angle);

        obj_phoebe.position.x = this.position.x + this.radius * Math.cos(this.angle + Math.PI);
        obj_phoebe.position.y = this.position.y + this.radius * Math.sin(this.angle + Math.PI);

        this.angle += this.angleSpeed;
    }

    draw() {
        obj_phoebe.draw();
        obj_rishav.draw();
    }
};
var obj_player = new ObjPlayer(duetGameScreen.context);

//button objects
class ObjButton extends GameObject {
    inBox(x, y) {
        if (Math.abs(x - this.position.x) <= 32 && Math.abs(y - this.position.y) <= 32) 
            return true;
        return false;
    }
}
var obj_arrow_right = new ObjButton(duetGameScreen.context);
var obj_arrow_left = new ObjButton(duetGameScreen.context);
var obj_play_button = new ObjButton(introGameScreen.context);


//obstacles
function obstacleSpawnControl () {
    if (ObjObstacle.spawned.length < ObjObstacle.maxSpawn && ObjObstacle.obstacleSpawning == 0) {
        var type = Math.floor(Math.random() * ObjObstacle.spawnableTypes.length);
        var i = ObjObstacle.spawned.push(new ObjObstacle(duetGameScreen.context, ObjObstacle.spawnablePositions[type]));
        i -= 1;
        ObjObstacle.spawned[i].spawnIndex = i;
        ObjObstacle.spawned[i].sprite.push(ObjObstacle.spawnableTypes[type]);
        ObjObstacle.obstacleSpawning = 200 / ObjObstacle.obstacleSpeed;
    }

    ObjObstacle.spawned.forEach(function (value, index, array) {
        value.update();
    });

    if (ObjObstacle.obstacleSpawning > 0) {
        ObjObstacle.obstacleSpawning -= 1;
    }
    else if (ObjObstacle.obstacleSpawning < 0) {
        ObjObstacle.obstacleSpawning = 0;
    }

    ObjObstacle.obstacleSpeed = 2 + Math.floor(score/50);
    obj_player.speed = Math.PI * ObjObstacle.obstacleSpeed / 180;
}

function obstacleDrawControl() {
    ObjObstacle.spawned.forEach(function (value, index, array) {
        value.draw();
    });
}

class ObjObstacle extends GameObject {
    constructor(context, positions = [0]) {
        super(context);

        this.position.x = positions[Math.floor(Math.random() * positions.length)];
        this.speed = ObjObstacle.obstacleSpeed;
        this.position.y = -100;
        this.spawnIndex = 0;
    }

    update() {
        this.position.y += this.speed;
        if (this.position.y > duetGameScreen.canvas.height + this.sprite[0].origin.y) {
            ObjObstacle.spawned.shift();
        }

        //collision check
        if (this.inBox(obj_rishav.position.x, obj_rishav.position.y) || this.inBox(obj_phoebe.position.x, obj_phoebe.position.y)) {
            console.log("collide");
        }
    }

    inBox(x, y) { // preliminary
        if (x >= this.position.x - this.sprite[0].origin.x 
            && x <= this.position.x - this.sprite[0].origin.x + this.sprite[0].frames[0].width
            && y >= this.position.y - this.sprite[0].origin.y
            && y <= this.position.y - this.sprite[0].origin.y + this.sprite[0].frames[0].height)
            return true;
        return false;
    }
}
ObjObstacle.obstacleSpeed = 4;
ObjObstacle.spawned = [];
ObjObstacle.spawnableTypes = [spr_obstacle_horiz, spr_obstacle_vert];
ObjObstacle.spawnablePositions = [[100, 200], [100, 150, 200]];
ObjObstacle.maxSpawn = 3;
ObjObstacle.obstacleSpawning = 0;

//HUD
class ObjHUD extends GameObject {
    constructor (context) {
        super (context);
    }

    draw() {
        this.context.save();

        this.context.fillStyle = "rgba(255,255,255,0.5)";
        this.context.strokeStyle = "rgba(0,0,0,1)";

        this.context.fillRect(90, 10, 200, 50);
        this.context.strokeRect(90,10, 290, 50);

        this.context.fillStyle = "rgba(0,0,0,1)";
        this.context.fillText("Player: " + username, 100, 20);
        this.context.fillText("Score: " + score, 100, 40);
        
        this.context.restore();
    }

    update() {

    }
};
var obj_hud = new ObjHUD(duetGameScreen.context);

//initial screen
introGameScreen.start();