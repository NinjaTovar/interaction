/*
 * FlyMutant object. This class handles loading the necessary assets as well as defines
 * the update and draw function.
 *
 * Single constructor takes in the game context as its parameter. (There is no default) 
 */
class Sun
{
    /**
     * Single constructor for Fly. Loads assets and sets intial parameters including
     * the speed, starting x/y position, etc.
     * 
     * @constructor
     * @param {any} game A reference to the game engine.
     * @param {any} startX Starting x position of the fly being constructed.
     * @param {any} startY Starting x position of the fly being constructed.
     * @param {any} size Size of scale for character.
     */
    constructor(game, sunsOrigin)
    {
        this.hover = new Animation
            (
            AM.getAsset('images/sun.png'),
            547,    // frame width
            558,     // frame height
            1,      // sheet width
            0.1,    // frame duration
            1,      // frames in animation
            true,   // to loop or not to loop
            sunsOrigin.scale    // scale in relation to original image
            );

        this.sunsOrigin = sunsOrigin;
        this.x = this.sunsOrigin.x;
        this.y = this.sunsOrigin.y;
        this.speed = 20;
        this.ctx = game.ctx;
        this.isHeadingRight = true;
        this.currentScale = this.sunsOrigin.scale;

        // hit box
        this.size = this.sunsOrigin.scale;
        this.frameWidth = 547;
        this.frameHeight = 558;
        this.hitBox = {
            xPos: this.x,
            yPos: this.y,
            width: this.frameWidth * this.sunsOrigin.scale,
            height: this.frameHeight * this.sunsOrigin.scale
        };
        this.showOutline = false;
        this.destroyed = false;

        this.clock = new Timer();
        this.clockTick = this.clock.tick();
    }

    // Methods

    /**
     * Draw takes in the game context and uses that to define what update does.
     * 
     * @param {any} ctx  A reference to the Game Context.
     */
    draw(ctx)
    {
        this.hover.drawFrame(this.clockTick, ctx, this.x, this.y);
    }



    /** Update handles updating the objects world state. */
    update()
    {
        this.clockTick = this.clock.tick();

        if (this.currentScale !== this.sunsOrigin.scale)
        {
            this.hover = new Animation
                (
                AM.getAsset('images/sun.png'),
                547,    // frame width
                558,     // frame height
                1,      // sheet width
                0.1,    // frame duration
                1,      // frames in animation
                true,   // to loop or not to loop
                this.sunsOrigin.scale    // scale in relation to original image
                );
        }

    }

}

