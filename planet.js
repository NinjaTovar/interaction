/*
 * FlyMutant object. This class handles loading the necessary assets as well as defines
 * the update and draw function.
 *
 * Single constructor takes in the game context as its parameter. (There is no default) 
 */
class Planet
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
    constructor(game, sunsOrigin, size, solarDistance, planetsOrigin)
    {
        this.hover = new Animation
            (
            AM.getAsset(planetsOrigin.planet),
            planetsOrigin.frameWidth,    // frame width
            planetsOrigin.frameHeight,     // frame height
            1,      // sheet width
            0.1,    // frame duration
            1,      // frames in animation
            true,   // to loop or not to loop
            size    // scale in relation to original image
            );

        this.planetsOrigin = planetsOrigin;
        this.sunsOrigin = sunsOrigin;
        this.x;
        this.y;
        this.prevX = this.x;
        this.prevY = this.y;
        this.speed = 2000;
        this.game = game;
        this.ctx = game.ctx;
        this.isHeadingRight = true;



        // hit box
        this.size = size;
        this.frameWidth = planetsOrigin.frameWidth;
        this.frameHeight = planetsOrigin.frameHeight;
        this.hitBox = {
            xPos: this.x,
            yPos: this.y,
            width: this.frameWidth * this.size,
            height: this.frameHeight * this.size
        };
        this.showOutline = false;
        this.destroyed = false;

        this.planetsOrigins = {
            xPos: this.x + this.frameWidth * this.size,
            yPos: this.y + this.frameHeight * this.size
        };

        // physics
        this.degrees = 0;
        this.radians = 0;
        this.solarDistance = solarDistance;

        this.G = 6.6742e-11; // universal gravitational constant
        this.earthSunDistance = 1.496 * Math.pow(10, 11);
        this.angularVelocity = 1.990986 * Math.pow(10, -7);
        this.scaleFactor = this.earthSunDistance / this.solarDistance;
        this.deltaT = 3600 * 24 / 1000;
            
    }

    // Methods

    /**
     * Draw takes in the game context and uses that to define what update does.
     * 
     * @param {any} ctx  A reference to the Game Context.
     */
    draw(ctx)
    {
        if (this.showOutline)
        {
            this.ctx.save();
            // hit box
            this.ctx.beginPath();
            this.ctx.strokeStyle = 'white';
            this.ctx.rect(this.x, this.y, this.frameWidth * this.size, this.frameHeight * this.size);
            this.ctx.stroke();
            this.ctx.restore();
        }
        else 
        {
            this.ctx.restore();
            //this.ctx.beginPath();
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = "rgba(" + 238 + "," + 157 + "," + 16 + "," + 1 + ")";
            this.ctx.setLineDash([.5, 20]);
            //this.ctx.strokeStyle = 'hsl(' + 360 * Math.random() + ', 40%, 10%)';
            this.ctx.moveTo(this.prevX, this.prevY);
            this.ctx.lineTo(this.x, this.y);
            this.ctx.stroke();
            this.ctx.closePath();
            this.ctx.save();
            
        }





        this.prevX = this.x;
        this.prevY = this.y;

        //console.log(this.x);
        // If field "isHeadingRight" is false, play fly left animation
        if (this.isHeadingRight)
        {
            this.hover.drawFrame(this.game.clockTick, ctx, this.planetsOrigins.xPos, this.planetsOrigins.yPos)
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

        var vectorTowardsOrigin = {
            x: this.x - this.sunsOrigin.x,
            y: this.y - this.sunsOrigin.y
        }

        console.log('Position:  ' + this.x + ", " + this.y);
        console.log('Vector: ' + vectorTowardsOrigin.x + ', ' + vectorTowardsOrigin.y);

        this.x -= vectorTowardsOrigin.x * this.G;
        this.y -= vectorTowardsOrigin.y * this.G;

        /**
         * steps
         *      get two json objects: initial state and current state
         *      make functions:
         *          function calculateDistanceAcceleration(state)
         *          function calculateDistanceAcceleration(state)
         *          function newValue(currentValue, deltaT, derivative)
         *          function resetStateToInitialConditions()
         *          function scaledDistance()
         *          function updatePosition()
         *          function calculateNewPosition()
         *          function updateFromUserInput(solarMassMultiplier)
         *          
         *     might be it
         * */



        var that = this;

        this.game.entities.forEach(function (item, index, array)
        {
            if (item.size == .2)
            {
                that.pos = index;
                //that.destroyed = true;
            }

        });

        this.planetsOrigins.xPos = this.x - (this.frameWidth * this.size)/2;
        this.planetsOrigins.yPos = this.y - (this.frameHeight * this.size)/2;
            
    }

}

