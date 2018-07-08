// Class View
class View {

    constructor(window_, objects=[], width=100, height=100, fps=60) {
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

                    if(now > frameEndTime[i]) {
                        frameEndTime[i] = objects[i].animate(ctx, true );
                    } else {
                        !frameEndTime[i] ? frameEndTime[i] = objects[i].animate(ctx, false) 
                                         : objects[i].animate(ctx, false);
                    }
                }
            }
            requestAnimationFrame(draw);
        });
    }  
}

class Renderable {
    constructor(func=() => {}) {
        this.func = func;
    }

    animate(ctx, next=false) {
        return this.func(ctx, next);
    }
}

class Animatable extends Renderable {
    constructor(animation, action=() => {}) {
        super(function(ctx, next=false) { 
            if (!this.animation.ended()) this.action(next);
            return this.animation.render(ctx, this.posX, this.posY, next);
        });
        this.animation = animation;
        this.action = action;
    }
}

class Animation {

    constructor(sprite, rules) {
        this.sprite = sprite;
        this.rules  = rules;
        this.currentAnimation = 0;
        this.currentFrameNumber = 0;
        this.repeatNumber = 0;
        this.finished = true;
    }

    next() {
         if(this.repeatNumber < this.getRepeatNumber()) {
            if(this.currentFrameNumber <  this.getCurrentFrames().length - 1) {
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
        return this.repeatNumber >= this.getCurrentAnimation().repeat;
    }


    getCurrentAnimation() {
         return this.rules[this.currentAnimation];
    }

    getRepeatNumber() {
        return  this.getCurrentAnimation().repeat;
    }

    getCurrentFrames() {
        return this.getCurrentAnimation().frames;
    }

    getCurrentDurations() {
        return this.getCurrentAnimation().duration;
    }

    getCurrentFrameNumber() {
        return this.getCurrentFrames()[this.currentFrameNumber];
    }

    getCurrentFrameDuration() {
        return this.getCurrentDurations()[this.currentFrameNumber];
    }

    getCoords() {
         return this.sprite.frames[this.getCurrentFrameNumber()]
    }

    getX1() {
        return this.getCoords()[0];
    }

    getY1() {
        return this.getCoords()[1]
    }
    
    getX2() {
        return this.getCoords()[2];
    }

    getY2() {
        return this.getCoords()[3]
    }

    render(ctx, posX, posY, next) {
        if (next) this.next(); 
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

        this.finished = this.ended();
        if(this.finished) {
            this.currentAnimation = 0;
            this.currentFrameNumber = 0;
            this.repeatNumber = 0;
        }
        return this.finished ? 0 : start + this.getCurrentFrameDuration();
    }  
}

class Sprite {

    constructor(src, frames) {
        this.img = Resources.get(src);
        this.frames = frames;
    }

}