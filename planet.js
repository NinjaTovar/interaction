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

        //this.G = 6.6742e-11; // universal gravitational constant
        //this.earthSunDistance = 1.496 * Math.pow(10, 11);
        //this.angularVelocity = 1.990986 * Math.pow(10, -7);
        //this.scaleFactor = this.earthSunDistance / this.solarDistance;
        //this.deltaT = 3600 * 24 / 1000;

        // *******************************************************************************
        // Physics constants
        this.constants = {
            gravitationalConstant: 6.67408 * Math.pow(10, -11),
            earthSunDistanceMeters: 1.496 * Math.pow(10, 11),
            earthAngularVelocityMetersPerSecond: 1.990986 * Math.pow(10, -7),
            massOfTheSunKg: 1.98855 * Math.pow(10, 30)
        };

        // The length of one AU (Earth-Sun distance) in pixels.
        this.pixelsInOneEarthSunDistancePerPixel = this.solarDistance;

        // A factor by which we scale the distance between the Sun and the Earth
        // in order to show it on screen
        this.scaleFactor = this.constants.earthSunDistanceMeters / this.pixelsInOneEarthSunDistancePerPixel;

        // The number of calculations of orbital path done in one 16 millisecond frame.
        // The higher the number, the more precise are the calculations and the slower the simulation.
        this.numberOfCalculationsPerFrame = 1000;

        // The length of the time increment, in seconds.
        this.deltaT = 3600 * 24 / this.numberOfCalculationsPerFrame;

        // Initial condition of the model
        this.initialConditions = {
            distance: {
                value: this.constants.earthSunDistanceMeters,
                speed: 0.00
            },
            angle: {
                value: Math.PI / 6,
                speed: this.constants.earthAngularVelocityMetersPerSecond
            }
        };

        // Current state of the system
        this.state = {
            distance: {
                value: 0,
                speed: 0
            },
            angle: {
                value: 0,
                speed: 0
            },
            massOfTheSunKg: this.constants.massOfTheSunKg,
            paused: false
        };

        //console.log(this.initialConditions);
        //console.log(this.state.distance.value);
        this.resetStateToInitialConditions();

        //********************************************************************************
    }

    calculateDistanceAcceleration(state)
    {
        // [acceleration of distance] = [distance][angular velocity]^2 - G * M / [distance]^2
        return state.distance.value * Math.pow(state.angle.speed, 2) -
            (this.constants.gravitationalConstant * state.massOfTheSunKg) / Math.pow(state.distance.value, 2);
    }
    calculateAngleAcceleration(state)
    {
        // [acceleration of angle] = - 2[speed][angular velocity] / [distance]
        return -2.0 * state.distance.speed * state.angle.speed / state.distance.value;
    }
    // Calculates a new value based on the time change and its derivative
    // For example, it calculates the new distance based on the distance derivative (velocity)
    // and the elapsed time interval.
    newValue(currentValue, deltaT, derivative)
    {
        //console.log(derivative);
        return currentValue + deltaT * derivative;
    }
    resetStateToInitialConditions()
    {
        this.state.distance.value = this.initialConditions.distance.value;
        this.state.distance.speed = this.initialConditions.distance.speed;

        this.state.angle.value = this.initialConditions.angle.value;
        this.state.angle.speed = this.initialConditions.angle.speed;
    }
    // The distance that is used for drawing on screen
    scaledDistance()
    {
        return this.state.distance.value / this.scaleFactor;
    }
    // The main function that is called on every animation frame.
    // It calculates and updates the current positions of the bodies
    updatePosition()
    {
        if (this.state.paused) { return; }
        for (var i = 0; i < this.numberOfCalculationsPerFrame; i++)
        {
            this.calculateNewPosition();
        }
    }

    // Calculates position of the Earth
    calculateNewPosition()
    {
        // Calculate new distance
        var distanceAcceleration = this.calculateDistanceAcceleration(this.state);
        //console.log(this.state.distance.speed);
        //console.log(distanceAcceleration);
        this.state.distance.speed = this.newValue(this.state.distance.speed, this.deltaT, distanceAcceleration);
        this.state.distance.value = this.newValue(this.state.distance.value, this.deltaT, this.state.distance.speed);

        //console.log(this.state.distance.speed);
        //console.log(this.state.distance.value);

        // Calculate new angle
        var angleAcceleration = this.calculateAngleAcceleration(this.state);
        this.state.angle.speed = this.newValue(this.state.angle.speed, this.deltaT, angleAcceleration);
        this.state.angle.value = this.newValue(this.state.angle.value, this.deltaT, this.state.angle.speed);

        //console.log(this.state.angle.speed);
        //console.log(this.state.angle.value);

        if (this.state.angle.value > 2 * Math.PI)
        {
            this.state.angle.value = this.state.angle.value % (2 * Math.PI);
        }
    }

    // Updates the mass of the Sun
    updateFromUserInput(solarMassMultiplier)
    {
        this.state.massOfTheSunKg = this.constants.massOfTheSunKg * solarMassMultiplier;
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
            //this.ctx.restore();
            //this.ctx.beginPath();
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = "rgba(" + 238 + "," + 157 + "," + 16 + "," + 1 + ")";
            this.ctx.setLineDash([.5, 20]);
            //this.ctx.strokeStyle = 'hsl(' + 360 * Math.random() + ', 40%, 10%)';
            this.ctx.moveTo(this.prevX, this.prevY);
            this.ctx.lineTo(this.x, this.y);
            this.ctx.stroke();
            //this.ctx.save();
            
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
        //if (this.degrees < 360)
        //{
        //    this.degrees += 1;
        //}
        //else
        //{
        //    this.degrees = 0;
        //}

        //this.radians = this.degrees * (Math.PI / 180);

        //this.x = (Math.cos(this.radians) * this.solarDistance) + this.sunsOrigin.x + (this.sunsOrigin.width / 2) * this.sunsOrigin.scale;
        //this.y = (Math.sin(this.radians) * this.solarDistance) + this.sunsOrigin.y + (this.sunsOrigin.height / 2) * this.sunsOrigin.scale;

        //var vectorTowardsOrigin = {
        //    x: this.x - this.sunsOrigin.x,
        //    y: this.y - this.sunsOrigin.y
        //}

        //console.log('Position:  ' + this.x + ", " + this.y);
        //console.log('Vector: ' + vectorTowardsOrigin.x + ', ' + vectorTowardsOrigin.y);

        //this.x -= vectorTowardsOrigin.x * this.G;
        //this.y -= vectorTowardsOrigin.y * this.G;

        this.updatePosition();

        //console.log(this.state.angle.speed);
        //console.log(this.scaledDistance());
        this.state.massOfTheSunKg = this.constants.massOfTheSunKg * this.sunsOrigin.mass

        this.x = Math.cos(this.state.angle.value) * this.scaledDistance() + this.sunsOrigin.x + (this.sunsOrigin.width / 2) * this.sunsOrigin.scale;
        this.y = Math.sin(-this.state.angle.value) * this.scaledDistance() + this.sunsOrigin.y + (this.sunsOrigin.height / 2) * this.sunsOrigin.scale;
        //console.log(this.x);
        

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

