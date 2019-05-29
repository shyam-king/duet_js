class GameControl {
    constructor(canvasid) {
        this.canvas = document.getElementById(canvasid);
        console.log("Selected canvas: " + canvasid);
        this.context = null;
        if (this.canvas.getContext) {
            this.context = this.canvas.getContext("2d");
            console.log("2d context available");
        }
    }

    init() {
        //initialize game -- overload
        console.log("Game begun");
    }

    start() {
        if (this.context != null) {
            this.init();
            window.requestAnimationFrame(this.redraw);
            window.setInterval(this.update, 1000/60); //60FPS game-updates
        }
    }

    redraw() {
        //overload
    }

    update() {
        //overload
    }
};


class GameSprite {
    constructor() {
        this.frames = [];
    }

    addFrame(src) {
        GameSprite.totalImages += 1;
        this.frames.push(new Image());
        var image = this.frames[this.frames.length - 1];
        image.src = src;
        image.onload = function () {
            GameSprite.loadedImages += 1;
            console.log("Loaded: " + this.src);
        };
    }

    static loaded() {
        return (GameSprite.totalImages == GameSprite.loadedImages);
    }
};

GameSprite.totalImages = 0;
GameSprite.loadedImages = 0;

class GameObject {
    constructor(canvasContext) {
        this.context = canvasContext;
        this.position = {x: 0, y: 0};
        this.sprite = [];
        this.image_index = 0;
        this.image_speed = 1.0;
        this.sprite_index = 0;
        this.image_scale = {x: 1, y: 1};
    }

    draw() {
        if (this.sprite.length != 0) {
            var sprite = this.sprite[this.sprite_index];
            var image = this.sprite[this.sprite_index].frames[Math.floor(this.image_index)];
            this.context.drawImage(image, this.position.x, this.position.y, this.image_scale.x * image.width, this.image_scale.y * image.height);
            this.image_index += this.image_speed;
            if (this.image_index >= sprite.length) {
                this.image_index = 0;
            }
            else if (this.image_index < 0) {
                this.image_index = sprite.length - 1;
            }
        }
    }

    update() {
        Console.log("Overload update()");
    }
};

