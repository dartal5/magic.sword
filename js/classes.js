class Swordman extends Animatable {

    constructor(name, posX, posY) {
        super(new Animation(
                new Sprite('img/character.png', 
                [[0,   0, 52,  72], [54,  0, 106, 72], [108, 0, 161, 72], 
                 [162, 0, 215, 72], [216, 0, 269, 72], [270, 0, 323, 72], 
                 [324, 0, 374, 72], [379, 0, 429, 72], [433, 0, 482, 72],
                 [486, 0, 539, 72], [540, 0, 593, 72], [594, 0, 646, 72]]), 

            [{ 'name': 'stand',      'repeat': 0, 'frames': [0               ], 'duration': [0]                  },
             { 'name': 'moveDown',   'repeat': 3, 'frames': [1,   2,   1,   2], 'duration': [150, 150, 150, 150] },
             { 'name': 'moveUp',     'repeat': 3, 'frames': [7,   8,   7,   8], 'duration': [150, 150, 150, 150] },
             { 'name': 'moveLeft',   'repeat': 3, 'frames': [4,   5,   4,   5], 'duration': [150, 150, 150, 150] },
             { 'name': 'moveRight',  'repeat': 3, 'frames': [10,  11,  10, 11], 'duration': [150, 150, 150, 150] }]));
        this.name      = name;
        this.posX      = posX;
        this.posY      = posY; 

        this.actionArr = {
            'stand'     : function() { }, 
            'moveUp'    : function(next) { if(next) this.posY-=5},
            'moveDown'  : function(next) { if(next) this.posY+=5},
            'moveLeft'  : function(next) { if(next) this.posX-=5},
            'moveRight' : function(next) { if(next) this.posX+=5},
        }

        this.currentAction = 'stand';
        this.action = this.actionArr[this.currentAction];

        var this_ = this;
        document.addEventListener("keydown", function() { 
            this_.actionChange(event['keyCode'])
        });
    }

    actionChange(keyCode) {
        if(this.animation.finished) {
            switch (keyCode) {
                case 37:
                    this.currentAction = 'moveLeft';
                    this.animation.currentAnimation = 3;
                    break;
                case 39:
                    this.currentAction = 'moveRight';
                    this.animation.currentAnimation = 4;
                    break;
                case 38:
                    this.currentAction = 'moveUp';
                    this.animation.currentAnimation = 2;
                    break;
                case 40:
                    this.currentAction = 'moveDown';
                    this.animation.currentAnimation = 1;
            }
            this.animation.repeatNumber = 0;
            this.animation.currentFrameNumber = 0;
            this.action = this.actionArr[this.currentAction];
        }
    }
}

class Map extends Renderable {

    constructor(width, height) {
        super(function (ctx) { ctx.drawImage(Resources.get('img/background.png'), 0,  0, this.width, this.height) });

        this.width = width;
        this.height = height;
    }

}