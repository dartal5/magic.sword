// Class View
class View {

    constructor(window_, objects=[], width=100, height=100, fps=120) {
        this.view = document.createElement('canvas');
        this.view.setAttribute('width', width);
        this.view.setAttribute('height', height);
        this.ctx = this.view.getContext('2d');  
        this.objects = objects;
        this.fps = fps;
        
        window_.appendChild(this.view);  
    }
    

    render() {
        var view    = this;
        var objects = view.objects;
        var ctx     = view.ctx

        var fpsInterval = 1000 / view.fps;
        var frameEndTime = [];

        var now;
        var elapsed;
        var then = Date.now();
        
        requestAnimationFrame(function draw() {
            now = Date.now();
            elapsed = now - then;

            if (elapsed > fpsInterval) {
                for(var i = 0; i < objects.length; i++) {
                    then = now - (elapsed - fpsInterval);

                    if(!frameEndTime[i]) {
                        frameEndTime[i] = objects[i].animate(ctx, false);
                    } else {
                        objects[i].animate(ctx, false);
                    }

                    if(now > frameEndTime[i])  frameEndTime[i] = objects[i].animate(ctx, true);
                }
            }
            requestAnimationFrame(draw);
        });
    }  
}


class Sprite {

    constructor(src, frames) {
        this.img = Resources.get(src);
        this.frames = frames;
    }

}


class Animation {

    constructor(sprite, rules) {
        this.sprite = sprite;
        this.rules  = rules;
        this.currentAnimation = 0;
        this.currentFrameNumber = 0;
        this.repeatNumber = 0;
    }

    getCurrent() {
        return this.rules[this.currentAnimation][this.currentFrameNumber];
    }

    next() {
         if(this.repeatNumber < this.rules[this.currentAnimation]['repeat']) {
            if(this.currentFrameNumber < this.rules[this.currentAnimation]['frames'].length - 1) {
                this.currentFrameNumber++; 
            } else {
                this.repeatNumber++;
                this.currentFrameNumber=0;
            }
            return false;
        }
        return true;
    }

    ended() {
        return this.repeatNumber >= this.rules[this.currentAnimation]['repeat'];
    }

    getCurrentFrameNumber() {
        return this.rules[this.currentAnimation]['frames'][this.currentFrameNumber];
    }

    getCurrentFrameDuration() {
        return this.rules[this.currentAnimation]['duration'][this.currentFrameNumber];
    }

    getX1() {
        return this.sprite.frames[this.getCurrentFrameNumber()][0];
    }

    getY1() {
        return this.sprite.frames[this.getCurrentFrameNumber()][1]
    }
    
    getX2() {
        return this.sprite.frames[this.getCurrentFrameNumber()][2];
    }

    getY2() {
        return this.sprite.frames[this.getCurrentFrameNumber()][3]
    }

    render(ctx, posX, posY) {
        var start = Date.now();
        ctx.drawImage(
            this.sprite.img, 
            this.getX1(), 
            this.getY1(),
            Math.abs(this.getX1() - this.getX2()), 
            Math.abs(this.getY1() - this.getY2()), 
            posX, 
            posY, 
            Math.abs(this.getX1() - this.getX2()), 
            Math.abs(this.getY1() - this.getY2()));

        return this.ended() ? 0 : start + this.getCurrentFrameDuration();
    }  
}

class Player {

    constructor(name, animation, posX=0, posY=0) {
        this.name      = name;
        this.animation = animation;
        this.posX      = posX;
        this.posY      = posY;
    }

    animate(ctx, next=false) {
        if(next) this.animation.next(); 
        return this.animation.render(ctx, this.posX, this.posY);
    }
}

class Map {

    constructor(width, height) {
        this.width = width;
        this.height = height;
    }

    animate(ctx, next=false) {
        ctx.fillStyle = 'green';
        ctx.fillRect(0, 0, this.width, this.height);
        return 0;
    }
}