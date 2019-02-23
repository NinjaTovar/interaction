/** 
 * GameEngine is the... game engine of the game world. Acts as the interface between
 * a user and the game world.
 */
class GameEngine
{
    /** 
     *  Initializes fields for the GameEngine. This includes creating an array for the
     *  potential entities that will get loaded into the world, and declaring a game 
     *  context that will eventually get intialized.
     *  
     *  @constructor
     */
    constructor()
    {
        this.entities = [];
        this.ctx = null;
        this.surfaceWidth = null;
        this.surfaceHeight = null;
    }

    /**
     * Initializes the game worlds event listeners and functions for controlling 
     * animation.
     * 
     * @param {any} ctx A reference to the game context.
     */
    init(bottomProjectionContext, middleProjectionContext, gameCtx, assetManager)
    {
        // initialize game world features. Context, timer, canvas width and height, etc.
        //this.overlayCtx = overlayProjectionContext;
        this.ctx = gameCtx;
        this.middleProjectionCtx = middleProjectionContext;
        this.bottomProjectionCtx = bottomProjectionContext;
        this.AM = assetManager;
        this.surfaceWidth = this.ctx.canvas.width;
        this.surfaceHeight = this.ctx.canvas.height;
        this.timer = new Timer();

        // Setup slider for solar mass
        var slider = document.getElementById('size');
        var output = document.getElementById('mass');
        output.innerHTML = slider.value;
        slider.oninput = function ()
        {
            var num = this.value;

            if (num >= 0)
            {
                if (num == 0)
                    num++;
                output.innerHTML = num;

            }
            else
            {
                num = -1 / num;
                output.innerHTML = num;
            }
        }


        // Setup HTML Buttons
        var godModeButton = document.getElementById('godMode');
        var background = document.getElementById('background');

        // 'images/galaxy.png'

        var galaxies = [];
        galaxies.push('images/galaxy.png');
        galaxies.push('images/galaxy.jpg');
        galaxies.push('images/galaxy2.jpg');

        // Initialize starting background
        this.addEntity(new Background(this, galaxies));

        // On change background click, shift array for images
        background.onclick = function ()
        {
            
            var temp = galaxies.shift();
            if (temp !== undefined)
            {
                galaxies.push(temp);
            }

        };

        this.sunsOrigin = {
            x: screen.width / 2,
            y: this.surfaceHeight / 2,
            width: 547,
            height: 558,
            scale: .2
        };

        this.addEntity(new Sun(this, this.sunsOrigin.x, this.sunsOrigin.y, this.sunsOrigin.scale));
        this.addEntity(new Earth(this, this.sunsOrigin, .08));


        // Set listeners
        this.initializeEventListeners();

        console.log('game initialized');
    }

    /** Starts the game world by getting the loop and callback circle started. */
    start()
    {
        console.log('starting game');
        let that = this;
        (function gameLoop()
        {
            that.loop();
            requestAnimationFrame(gameLoop, that.ctx.canvas);
        })();
    }

    /**
     * The meat and potatoes of the game world. Adds entities to the game.
     * 
     * @param {any} entity An entity such as characters or platforms to bring into the 
     *                     world. Added to the entity[] field in the game and can
     *                     be continually referenced, as all entities have a reference
     *                     to the game.
     */
    addEntity(entity)
    {
        console.log('added entity');
        this.entities.push(entity);
    }

    /** 
     *  Calls all of the entities draw function that have been added to the engines
     *  entity[] array.
     */
    draw()
    {
        // normal draw function for each entity. We didn't make this.
        this.ctx.clearRect(0, 0, this.surfaceWidth, this.surfaceHeight);
        this.ctx.save();
        for (let i = 0; i < this.entities.length; i++)
        {
            this.entities[i].draw(this.ctx);
        }
        this.ctx.restore();
    }

    /** Handles updating the entities world state. */
    update()
    {
        let entitiesCount = this.entities.length;

        for (let i = 0; i < entitiesCount; i++)
        {
            let entity = this.entities[i];

            entity.update();
        }
    }

    /** Keeps the world ticking. */
    loop()
    {
        // everyone's clock tick besides blink
        this.clockTick = this.timer.tick();

        // As loop is continuously called, drive the game for all
        this.update();
        this.draw();
    }



    /** Initializes event listeners for game. */
    initializeEventListeners()
    {
        // use that to refer to other classes use of these listeners
        const that = this;

        // Event Listeners
        this.ctx.canvas.addEventListener(
            'mousedown',
            e =>
            {
                switch (e.button)
                {
                    case 0:
                        that.levelStarted = true;
                        break;
                    default:
                        break;
                }
            },
            false
        );

        // Event Listeners
        this.ctx.canvas.addEventListener(
            'keydown',
            e =>
            {
                switch (e.key)
                {
                    case 'ArrowRight':
                        that.moving = true;
                        that.facingRight = true;
                        break;
                    case 'ArrowLeft':
                        that.moving = true;
                        that.facingRight = false;
                        break;
                    case 'A': // a is attack
                    case 'a': // a is attack
                        that.basicAttack = true;
                        break;
                    case 'S': // s is stop time spell
                    case 's': // s is stop time spell
                        that.stopTime = true;
                        break;
                    case 'D': // d is rewind time spell
                    case 'd': // d is rewind time spell
                        that.rewindTime = true;
                        this.resetPaths = false;
                        break;
                    case 'W': // w is slow time spell
                    case 'w': // w is slow time spell
                        that.slowTime = true;
                        break;
                    case 'F': // F is speed time spell
                    case 'f': // f is speed time spell
                        that.speedTime = true;
                        break;
                    case ' ': // spacebar is jump
                        that.jumping = true;
                        break;
                    default:
                        break;
                }
                e.preventDefault();
            },
            false
        );


        this.ctx.canvas.addEventListener(
            'keyup',
            e =>
            {
                switch (e.key)
                {
                    case 'ArrowRight':
                        that.moving = false;
                        break;
                    case 'ArrowLeft':
                        that.moving = false;
                        break;
                    case 'A':
                    case 'a':
                        that.basicAttack = false;
                        break;
                    case 'S':
                    case 's':
                        that.stopTime = false;
                        break;
                    case 'D':
                    case 'd':
                        that.rewindTime = false;
                        that.resetPaths = true;
                        break;
                    case 'W':
                    case 'w':
                        that.slowTime = false;
                        break;
                    case 'F':
                    case 'f':
                        that.speedTime = false;
                        break;
                    default:
                        break;
                }
                e.preventDefault();
            },
            false
        );
    }

}

// This helps discover what type of browser it will be communicating with
window.requestAnimFrame = (function ()
{
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback, element)
        {
            window.setTimeout(callback, 1000 / 60);
        }
    );
})();