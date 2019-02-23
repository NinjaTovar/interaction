/*
 * FlyMutant object. This class handles loading the necessary assets as well as defines
 * the update and draw function.
 *
 * Single constructor takes in the game context as its parameter. (There is no default) 
 */
class Earth
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
    constructor(game, sunsOrigin, size)
    {
        this.hover = new Animation
            (
            AM.getAsset('images/earth.png'),
            511,    // frame width
            513,     // frame height
            1,      // sheet width
            0.1,    // frame duration
            1,      // frames in animation
            true,   // to loop or not to loop
            size    // scale in relation to original image
            );

        this.sunsOrigin = sunsOrigin;
        this.x = sunsOrigin.x;
        this.y = sunsOrigin.y;
        this.speed = 20;
        this.game = game;
        this.ctx = game.ctx;
        this.isHeadingRight = true;

        // physics
        this.degrees = 0;
        this.radians = 0;
        this.solarDistance = 100;

        //// The number of calculations of orbital path done in one 16 millisecond frame.
        //// The higher the number, the more precise are the calculations and the slower the simulation.
        //var numberOfCalculationsPerFrame = 1000;

        //// The length of the time increment, in seconds.
        //var deltaT = 3600 * 24 / numberOfCalculationsPerFrame;

        //// Calculates the position of the Earth
        //this.constants = {
        //    gravitationalConstant: 6.67408 * Math.pow(10, -11),
        //    earthSunDistanceMeters: 1.496 * Math.pow(10, 11),
        //    earthAngularVelocityMetersPerSecond: 1.990986 * Math.pow(10, -7),
        //    massOfTheSunKg: 1.98855 * Math.pow(10, 30)
        //}
        //// Initial condition of the model
        //this.initialConditions = {
        //    distance: {
        //        value: this.constants.earthSunDistanceMeters,
        //        speed: 0.00
        //    },
        //    angle: {
        //        value: Math.PI / 6,
        //        speed: this.constants.earthAngularVelocityMetersPerSecond
        //    }
        //};
        //// Current state of the system
        //this.state = {
        //    distance: {
        //        value: 0,
        //        speed: 0
        //    },
        //    angle: {
        //        value: 0,
        //        speed: 0
        //    },
        //    massOfTheSunKg: this.constants.massOfTheSunKg,
        //    paused: false
        //};
            
    }

    // Methods

    /**
     * Draw takes in the game context and uses that to define what update does.
     * 
     * @param {any} ctx  A reference to the Game Context.
     */
    draw(ctx)
    {

        console.log(this.x);
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
        if (this.degrees < 360)
        {
            this.degrees += 1;
        }
        else
        {
            this.degrees = 0;
        }

        this.radians = this.degrees * (Math.PI / 180);

        this.x = (Math.cos(this.radians) * this.solarDistance) + this.sunsOrigin.x + (this.sunsOrigin.width / 2) * this.sunsOrigin.scale;
        this.y = (Math.sin(this.radians) * this.solarDistance) + this.sunsOrigin.y + (this.sunsOrigin.height / 2) * this.sunsOrigin.scale;
        
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

