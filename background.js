/** Handles loading the static background of a level. */
class Background
{
    /**
     * Loads a static image for the background.
     * 
     * @constructor
     * @param {any} game A reference to the game engine
     */
    constructor(game, theGalaxies)
    {
        this.x = 0;
        this.y = 0;
        this.game = game;
        this.ctx = game.ctx;
        this.theGalaxies = theGalaxies
    }

    /**
     * 
     * @param {any} ctx A reference to the game context.
     */
    draw(ctx)
    {
        this.ctx.drawImage(AM.getAsset(this.theGalaxies[0]), this.x, this.y);
    }

    /**  */
    update()
    {

    }
}

