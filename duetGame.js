//misc
class ScoreItem {
    constructor(name, score) {
        this.name = name;
        this.score = Number.parseInt(score);
    }
};

var username_field = document.getElementById("username");
var username2_field = document.getElementById("username2");
var nameSubmit_button = document.getElementById("nameSubmitButton");
var canPlay = false;
var username = "";
var username2 = "";
var scorecard_table = document.getElementById("scorecard");
var initialScoreSet = [];

nameSubmit_button.onclick = function() {
    if (username_field.value != "") {
        canPlay = true;
        username =  username_field.value;
        username_field.value = "";
        username2 = username2_field.value;
        username2_field.value = "";
    }
};

function readScore() {
    initialScoreSet = [];
    if (localStorage.getItem("highscores") != null) {
        initialScoreSet = JSON.parse(localStorage.getItem("highscores"));
    }

    if (initialScoreSet.length > 9) {
        initialScoreSet = initialScoreSet.slice(0,9);
    }

    scorecard_table.innerHTML = "<tr><th>S. No.</th><th>Name</th><th>Score</th></tr></tr><tr><td>1.</td><td>Jarvis</td><td>Infinity</td></tr>";
    initialScoreSet.forEach(function(value, index, array){
        var n = document.createElement("tr");
        var td = document.createElement("td");
        td.innerHTML = (index + 2) + ".";
        n.appendChild(td);

        td = document.createElement("td");
        td.innerHTML = value.name;
        n.appendChild(td);
        
        td = document.createElement("td");
        td.innerHTML = value.score;
        n.appendChild(td);

        scorecard_table.appendChild(n);
    });
}

function postScore() {
    var data = initialScoreSet.slice();
    data.push(new ScoreItem(username + " *", score));

    data.sort(function(a,b) {
        return b.score - a.score;
    });

    scorecard_table.innerHTML = "<tr><th>S. No.</th><th>Name</th><th>Score</th></tr></tr><tr><td>1.</td><td>Jarvis</td><td>Infinity</td></tr>";
    data.forEach(function(value, index, array){
        var n = document.createElement("tr");
        var td = document.createElement("td");
        td.innerHTML = (index + 2) + ".";
        n.appendChild(td);

        td = document.createElement("td");
        td.innerHTML = value.name;
        n.appendChild(td);
        
        td = document.createElement("td");
        td.innerHTML = value.score;
        n.appendChild(td);

        scorecard_table.appendChild(n);
    });
}

//LOAD SPRITES
var spr_rishav = new GameSprite(8,8);
spr_rishav.addFrame("res/rishav.png");
var spr_phoebe = new GameSprite(8,8);
spr_phoebe.addFrame("res/phoebe.png");
var spr_arrow_right = new GameSprite(30,30);
spr_arrow_right.addFrame("res/arrow_right.png");
var spr_background = new GameSprite();
spr_background.addFrame("res/bg.png");
var spr_obstacle_horiz = new GameSprite(50, 25);
spr_obstacle_horiz.addFrame("res/obstacle_horizontal.png");
var spr_obstacle_vert = new GameSprite(25, 50);
spr_obstacle_vert.addFrame("res/obstacle_vertical.png");
var spr_play_button = new GameSprite(100,100);
spr_play_button.addFrame("res/play_button.png"); 
var spr_pause_button = new GameSprite(16,16);
spr_pause_button.addFrame("res/pause.png");
spr_pause_button.addFrame("res/unpause.png");
var spr_restart_button = new GameSprite(16,16);
spr_restart_button.addFrame("res/restart.png");
var spr_horlicks = new GameSprite(25, 50);
spr_horlicks.addFrame("res/horlicks.png");
var spr_rishav_power = new GameSprite(16,16);
spr_rishav_power.addFrame("res/rishav_power2.png");
spr_rishav_power.addFrame("res/rishav_power1.png");
spr_rishav_power.addFrame("res/rishav_power0.png");
spr_rishav_power.addFrame("res/rishav_power1.png");
var spr_flight = new GameSprite(32,32);
spr_flight.addFrame("res/flight.png");

//game-specific global vars
var time; 
var score; //time in seconds

//intro screen
class IntroGameScreen extends GameControl {
    init() {
        obj_play_button.image_speed = 0;
        obj_play_button.image_index = 0;
        obj_play_button.position = {
            x: this.canvas.width/2,
            y: this.canvas.height/2 + 20
        };
        if (!canPlay)
        {
            username = "";
        }
        readScore();

        //INPUT HANDLING
        introGameScreen.canvas.addEventListener("mousedown", this.mouseDown);
    }

    finalize () {
        introGameScreen.canvas.removeEventListener("mousedown", this.mouseDown);
    }

    mouseDown (ev) {
        var rect = introGameScreen.canvas.getBoundingClientRect();
        var x = ev.clientX - rect.x;
        var y = ev.clientY - rect.y;

        if(canPlay && obj_play_button.inBox(x,y)) {
            introGameScreen.stop();
            duetGameScreen.start();
        }
    }

    update() {
        readScore();
    }

    redraw() {
        var ctx = introGameScreen.context;
        var canv = introGameScreen.canvas;

        if(GameSprite.loaded()) {
            obj_bg.draw();
            obj_play_button.draw();

            ctx.save();
            ctx.font = "500 64px Roboto";
            var text = "Duet";
            ctx.fillStyle = "rgba(200,200,200,1)";
            var x = canv.width/2 - ctx.measureText(text).width/2;
            ctx.fillText(text, x, 100);

            text = username;
            ctx.font = "400 50px Roboto";
            x = canv.width/2 - ctx.measureText(text).width/2;
            ctx.fillText(text, x, 450);
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
        obj_pause_button.draw();
        obj_restart_button.draw();
    
        window.requestAnimationFrame(duetGameScreen.redraw);
    }

    init() {
        //object(s) initializations
        obj_arrow_left.image_scale.x = -1;
        obj_arrow_left.position.y = this.canvas.height - 60;
        obj_arrow_right.position.y = this.canvas.height - 60;
        obj_arrow_left.position.x = 65;
        obj_arrow_right.position.x = this.canvas.width - 65;

        obj_pause_button.image_speed = 0;
        obj_pause_button.image_index = 0;
        obj_pause_button.position = {x: 26, y: 26};

        obj_restart_button.position = {x: 66, y: 26};

        //game var initializations
        time = 0;
        score = 0;
        ObjObstacle.obstacleSpeed = 2;
        ObjObstacle.spawned = [];
        ObjObstacle.obstacleSpawning = 0;
        obj_player.speed = Math.PI * 2 / 180;
        obj_player.angle = 0;
        obj_player.speed_multiplyer = 1;
        obj_player.horlicksMode = 0;
        obj_player.radius_p = 50;
        obj_player.radius_r = 50;

        //INPUT HANDLING
        document.addEventListener("keydown", this.keyControl);
        duetGameScreen.canvas.addEventListener("mousedown", this.mouseDown);
        duetGameScreen.canvas.addEventListener("mouseup", this.mouseUp);
        document.addEventListener("keyup", this.mouseUp);
    }

    update() {
        obj_player.update();
        obstacleSpawnControl();

        time += DuetGameScreen.gameSpeed;
        score = Math.floor(time / 60);

        postScore();
    }

    finalize() {
        document.removeEventListener("keydown", this.keyControl);
        document.removeEventListener("keyup", this.mouseUp);
        duetGameScreen.canvas.removeEventListener("mousedown", this.mouseDown);
        duetGameScreen.canvas.removeEventListener("mouseup", this.mouseUp);
    }

    keyControl(ev) {
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
    }

    mouseDown(ev) {
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
            else if (obj_pause_button.inBox(x, y)) {
                obj_pause_button.togglePause();
            }
            else if(obj_restart_button.inBox(x,y)) {
                duetGameScreen.stop();
                duetGameScreen.start();
            }

        }
    }

    mouseUp(ev) {
        obj_player.angleSpeed = 0;
    }
};
DuetGameScreen.gameSpeed = 1; 
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
        obj_rishav.sprite.push(spr_rishav_power);
        obj_phoebe.sprite.push(spr_phoebe);
        obj_rishav.sprite_index = 0;
        obj_rishav.image_speed = 0.25;
        this.position.x = duetGameScreen.canvas.width / 2;
        this.position.y = duetGameScreen.canvas.height - 60;

        this.radius_r = 50;
        this.radius_p = 50;
        this.speed = Math.PI * 2 / 180;
        this.angleSpeed = 0;
        this.horlicksMode = 0;
        this.speed_multiplyer = 1;
    }

    left() {
        this.angleSpeed = -this.speed;
    }

    right () {
        this.angleSpeed = this.speed;
    }

    update() {
        obj_rishav.position.x = this.position.x + this.radius_r * Math.cos(this.angle);
        obj_rishav.position.y = this.position.y + this.radius_r * Math.sin(this.angle);

        obj_phoebe.position.x = this.position.x + this.radius_p * Math.cos(this.angle + Math.PI);
        obj_phoebe.position.y = this.position.y + this.radius_p * Math.sin(this.angle + Math.PI);

        this.angle += this.angleSpeed * DuetGameScreen.gameSpeed * this.speed_multiplyer;

        if (this.horlicksMode > 0) {
            this.horlicksMode -= 1 * DuetGameScreen.gameSpeed;
            obj_rishav.sprite_index = 1;
            if (this.horlicksMode < 200) 
                obj_rishav.image_speed = 0.5;
        }
        else {
            obj_rishav.sprite_index = 0;
            obj_rishav.image_speed = 0.25;
        }

        if (this.speed_multiplyer > 1) {
            this.speed_multiplyer -= .001 * DuetGameScreen.gameSpeed;
        }
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
        if (Math.abs(x - this.position.x) <= this.sprite[0].origin.x 
        && Math.abs(y - this.position.y) <= this.sprite[0].origin.y) 
            return true;
        return false;
    }
}
var obj_arrow_right = new ObjButton(duetGameScreen.context);
var obj_arrow_left = new ObjButton(duetGameScreen.context);
obj_arrow_right.sprite.push(spr_arrow_right);
obj_arrow_left.sprite.push(spr_arrow_right);
var obj_play_button = new ObjButton(introGameScreen.context);
obj_play_button.sprite.push(spr_play_button);
var obj_restart_button = new ObjButton(duetGameScreen.context);
obj_restart_button.sprite.push(spr_restart_button);

class ObjPauseButton extends ObjButton {
    constructor (context) {
        super (context);
        this.paused = false;
    }

    togglePause() {
        this.paused = ! this.paused;
        if (this.paused) {
            this.image_index = 1;
            DuetGameScreen.gameSpeed = 0;
        }
        else {
            this.image_index = 0;
            DuetGameScreen.gameSpeed = 1;
        }
    }
}
var obj_pause_button = new ObjPauseButton(duetGameScreen.context);
obj_pause_button.sprite.push(spr_pause_button);


//obstacles
function obstacleSpawnControl () {
    if (ObjObstacle.spawned.length < ObjObstacle.maxSpawn && ObjObstacle.obstacleSpawning == 0) {
        var type = Math.floor(Math.random() * ObjObstacle.spawnableTypes.length);
        if (type > 1) {
            type = Math.floor(Math.random() * ObjObstacle.spawnableTypes.length);
        }
        if (type > 1) {
            type = Math.floor(Math.random() * ObjObstacle.spawnableTypes.length);
        }


        var i = ObjObstacle.spawned.push(new ObjObstacle(duetGameScreen.context, 
                                            ObjObstacle.spawnablePositions[type], 
                                            ObjObstacle.spawnableAngles[type], 
                                            ObjObstacle.spawnableSpeed[type],
                                            type));
        i -= 1;
        ObjObstacle.spawned[i].spawnIndex = i;
        ObjObstacle.spawned[i].sprite.push(ObjObstacle.spawnableTypes[type]);
        ObjObstacle.obstacleSpawning = 200 / ObjObstacle.obstacleSpeed;
    }

    ObjObstacle.spawned.forEach(function (value, index, array) {
        value.update();
    });

    if (ObjObstacle.obstacleSpawning > 0) {
        ObjObstacle.obstacleSpawning -= DuetGameScreen.gameSpeed;
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
    constructor(context, positions = [0], angles = [0], angleSpeed = [0], type = 0) {
        super(context);

        this.position.x = positions[Math.floor(Math.random() * positions.length)];
        if (score > 30)
            this.angle = angles[Math.floor(Math.random() * angles.length)];
        else
            this.angle = angles[0];
        this.speed = ObjObstacle.obstacleSpeed;
        this.position.y = -100;
        this.spawnIndex = 0;
        if (score > 75)
            this.angleSpeed = angleSpeed[Math.floor(Math.random() * angleSpeed.length)];
        else 
            this.angleSpeed = angleSpeed[0];
        this.type = type;
    }

    update() {
        this.position.y += this.speed * DuetGameScreen.gameSpeed;
        this.angle += this.angleSpeed * DuetGameScreen.gameSpeed;
        if (this.position.y > duetGameScreen.canvas.height + this.sprite[0].origin.y) {
            ObjObstacle.spawned.shift();
        }

        //collision check
        if(this.position.y >= 300) {
            if ((this.inBox(obj_rishav.position.x, obj_rishav.position.y) && obj_player.horlicksMode == 0) 
            || this.inBox(obj_phoebe.position.x, obj_phoebe.position.y)) {
                if (this.type == ObjObstacle.spawnableTypes.indexOf(spr_horlicks)) {
                    obj_player.horlicksMode = 600;
                }
                else if (this.type == ObjObstacle.spawnableTypes.indexOf(spr_flight)) {
                    obj_player.speed_multiplyer = 2;
                }
                else {
                    duetGameScreen.stop();
                    var flag = false;
                    initialScoreSet.forEach(function(value, index, array){
                        if (value.name == username) {
                            if (value.score < score) {
                                value.score = score;
                            }
                            flag = true;
                        }
                    });

                    if(!flag)
                        initialScoreSet.push(new ScoreItem(username, score));
                    initialScoreSet.sort(function(a, b){
                        return b.score - a.score;
                    });
                    localStorage.setItem("highscores", JSON.stringify(initialScoreSet));
                    canPlay = false;
                    if (username2 != "") {
                        username = username2;
                        username2 = "";
                        canPlay = true;
                    }
                    introGameScreen.start();
                }
            }    
        }
    }

    inBox(x, y) { // collision involving rotation
        let tx = x - this.position.x;
        let ty = y - this.position.y;
        let cos = Math.cos(this.angle);
        let sin = Math.sin(this.angle);

        let nx = Math.abs(tx * cos +ty * sin);
        let ny = Math.abs( -tx * sin + ty * cos);
        
        if (nx <= this.sprite[0].origin.x && ny <= this.sprite[0].origin.y) {
            return true;
        }
        return false;
    }
}
ObjObstacle.obstacleSpeed = 2;
ObjObstacle.spawned = [];
ObjObstacle.spawnableTypes = [spr_obstacle_horiz, spr_obstacle_horiz, spr_horlicks, spr_flight];
ObjObstacle.spawnablePositions = [[100, 200], [100, 150, 200], [100, 150, 200], [150]];
ObjObstacle.maxSpawn = 3;
ObjObstacle.obstacleSpawning = 0;
ObjObstacle.spawnableAngles = [[0, -Math.PI/4, Math.PI/4], 
                            [Math.PI/2, Math.PI/2 - Math.PI/12, Math.PI/2 + Math.PI/12],
                            [0],[0]];
ObjObstacle.spawnableSpeed = [[0, Math.PI/60, -Math.PI/60],
                            [0],
                            [0],[0]];

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
        this.context.font = "300 16px Roboto";
        this.context.fillText("Player: " + username, 100, 30);
        this.context.fillText("Score: " + score, 100, 50);
        
        this.context.restore();
    }

    update() {
        
    }
};
var obj_hud = new ObjHUD(duetGameScreen.context);

//initial screen
introGameScreen.start();