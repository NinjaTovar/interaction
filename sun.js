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
    constructor(game, startX, startY, size, isHeadingRight)
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
            size    // scale in relation to original image
            );

        this.x = startX;
        this.y = startY;
        this.speed = 20;
        this.game = game;
        this.ctx = game.ctx;
        this.isHeadingRight = isHeadingRight;



        // this will be used for rewind
        this.myPath = [];
        this.myPath.push(0);
        this.shouldRewind = false;
        this.resetPath = false;


    }

    // Methods

    /**
     * Draw takes in the game context and uses that to define what update does.
     * 
     * @param {any} ctx  A reference to the Game Context.
     */
    draw(ctx)
    {
        // If field "isHeadingRight" is false, play fly left animation
        if (this.isHeadingRight)
        {
            this.hover.drawFrame(this.game.clockTick, ctx, this.x, this.y)
        }
        if (!this.isHeadingRight)
        {
            this.hover.drawFrame(this.game.clockTick, ctx, this.x, this.y)
        }
    }



    /** Update handles updating the objects world state. */
    update()
    {
        if (this.isHeadingRight)
        {
            //this.x += this.game.clockTick * this.speed;
        }
        else if (!this.isHeadingRight)
        {
            //this.x -= this.game.clockTick * this.speed;
        }
    }

}

