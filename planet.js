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
    constructor(game, sunsOrigin, size, solarDistance, planetsOrigin, showOrbit)
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
        this.game = game;
        this.ctx = game.ctx;
        this.showOrbit = showOrbit;

        this.mouseIsHeld = false;

        this.radius = planetsOrigin.frameWidth / 2;
        this.circle = {
            radius: this.radius,
            x: this.x,
            y: this.y
        };

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
        //this.timeDelta = 3600 * 24 / 1000;

        // Credit for much of this math goes to open source website: https://evgenii.com
        // This was incredibly difficult to do and I spent many hours working on vectors
        // for gravity. This website was a lifesaver!
        // *******************************************************************************
        // Physics constants

        this.constants = {
            gravity: 6.67408 * Math.pow(10, -11), // Add some flavor to the orbits by changing the distance from the sun
            astronomicalUnit: 1.496 * Math.pow(10, Randomizer.returnRandomFloat(10.85, 11)),
            solarBodyVelocity: 1.990986 * Math.pow(10, -7),
            sunMass: 1.98855 * Math.pow(10, Randomizer.returnRandomFloat(29.5, 30.6))
        };
        //if (this.game.firstCosmos === false)
        //{
        //    this.constants.astronomicalUnit = Math.pow(10, Randomizer.returnRandomFloat(10.87, 11.21));
        //}

        // The length of one AU (Earth-Sun distance) in pixels.
        this.solarDistanceInPixels = this.solarDistance;

        // Solar distance scaled to pixels on-screen
        this.scaleFactor = this.constants.astronomicalUnit / this.solarDistanceInPixels;

        // number of calculations to do per frame animated
        this.calculationsPerTick = 10000;

        // time delta to be used for differentials
        this.timeDelta = 3600 * 24 / this.calculationsPerTick;

        // Initial conditions
        this.initialConditions = {
            distance: {
                value: this.constants.astronomicalUnit,
                speed: 0.00
            },
            angle: {
                value: (Randomizer.returnRandomInt(3) * (Math.PI / Randomizer.returnRandomIntBetweenThese(1, 6))),
                speed: this.constants.solarBodyVelocity
            }
        };

        // Current state of the solar body in distance and angles
        this.currentConditions = {
            distance: {
                value: 0,
                speed: 0
            },
            angle: {
                value: 0,
                speed: 0
            },
            sunMass: this.constants.sunMass,
        };

        //console.log(this.initialConditions);
        //console.log(this.currentConditions.distance.value);
        this.resetStateToInitialConditions();

        //********************************************************************************
    }

    // basic physics formulas found at https://evgenii.com/blog/earth-orbit-simulation/
    calculateDistanceAcceleration(currentState)
    {
        return currentState.distance.value * Math.pow(currentState.angle.speed, 2) -
            (this.constants.gravity * currentState.sunMass) / Math.pow(currentState.distance.value, 2);
    }
    calculateAngleAcceleration(currentState)
    {
        return -2.0 * currentState.distance.speed * currentState.angle.speed / currentState.distance.value;
    }
    // Calculates a value based on distance dx (velocity)
    // and the time delta
    newValue(currentValue, timeDelta, dx)
    {
        //console.log(dx);
        return currentValue + timeDelta * dx;
    }
    resetStateToInitialConditions()
    {
        this.currentConditions.distance.value = this.initialConditions.distance.value;
        this.currentConditions.distance.speed = this.initialConditions.distance.speed;

        this.currentConditions.angle.value = this.initialConditions.angle.value;
        this.currentConditions.angle.speed = this.initialConditions.angle.speed;
    }
    // The on-screen distance conversion
    scaledDistance()
    {
        return this.currentConditions.distance.value / this.scaleFactor;
    }
    // called on every update
    updatePosition()
    {
        for (var i = 0; i < this.calculationsPerTick; i++)
        {
            this.calculateNewPosition();
        }
    }

    // Calculates position of the Earth
    calculateNewPosition()
    {
        // Calculate new distance
        var distanceAcceleration = this.calculateDistanceAcceleration(this.currentConditions);
        //console.log(this.currentConditions.distance.speed);
        //console.log(distanceAcceleration);
        this.currentConditions.distance.speed = this.newValue(this.currentConditions.distance.speed, this.timeDelta, distanceAcceleration);
        this.currentConditions.distance.value = this.newValue(this.currentConditions.distance.value, this.timeDelta, this.currentConditions.distance.speed);

        //console.log(this.currentConditions.distance.speed);
        //console.log(this.currentConditions.distance.value);

        // Calculate new angle
        var angleAcceleration = this.calculateAngleAcceleration(this.currentConditions);
        this.currentConditions.angle.speed = this.newValue(this.currentConditions.angle.speed, this.timeDelta, angleAcceleration);
        this.currentConditions.angle.value = this.newValue(this.currentConditions.angle.value, this.timeDelta, this.currentConditions.angle.speed);

        //console.log(this.currentConditions.angle.speed);
        //console.log(this.currentConditions.angle.value);

        if (this.currentConditions.angle.value > 2 * Math.PI)
        {
            this.currentConditions.angle.value = this.currentConditions.angle.value % (2 * Math.PI);
        }
    }

    // Updates the mass of the Sun
    updateFromUserInput(solarMassMultiplier)
    {
        this.currentConditions.sunMass = this.constants.sunMass * solarMassMultiplier;
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
        else if (this.showOrbit)
        {
            //this.ctx.restore();
            //this.ctx.beginPath();
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = "rgba(" + 255 + "," + 195 + "," + 0 + "," + 1 + ")";
            this.ctx.setLineDash([.5, 5000]);
            //this.ctx.strokeStyle = 'hsl(' + 360 * Math.random() + ', 40%, 10%)';
            this.ctx.moveTo(this.prevX, this.prevY);
            this.ctx.lineTo(this.x, this.y);
            this.ctx.stroke();
            //this.ctx.save();
            
        }





        this.prevX = this.x;
        this.prevY = this.y;

        this.hover.drawFrame(this.game.clockTick, ctx, this.planetsOrigins.xPos, this.planetsOrigins.yPos);


    }



    /** Update handles updating the objects world state. */
    update()
    {

        if (this.game.mouseIsHeld != undefined)
        {
            this.mouseIsHeld = this.game.mouseIsHeld;
            //console.log(this.mouseIsHeld);
        }
        if (this.game.showOrbit != undefined)
        {
            this.showOrbit = this.game.showOrbit;
            //console.log(this.mouseIsHeld);
        }


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
        //console.log(this.sunsOrigin.radius);
        this.updatePosition();

        //console.log(this.currentConditions.angle.speed);
        //console.log(this.scaledDistance());
        this.currentConditions.sunMass = this.constants.sunMass * this.sunsOrigin.mass

        this.x = Math.cos(this.currentConditions.angle.value) * this.scaledDistance() + this.sunsOrigin.x + (this.frameWidth * this.size) / 2;
        this.y = Math.sin(-this.currentConditions.angle.value) * this.scaledDistance() + this.sunsOrigin.y + (this.frameHeight * this.size) / 2;

        // hit box work
        this.circle.x = this.x;
        this.circle.y = this.y;

        var dx = this.circle.x - (this.sunsOrigin.x + (this.sunsOrigin.width / 2) * this.sunsOrigin.scale);
        var dy = this.circle.y - (this.sunsOrigin.y + (this.sunsOrigin.height / 2) * this.sunsOrigin.scale);
        var distance = Math.sqrt(dx * dx + dy * dy);
        //console.log(distance > this.sunsOrigin.radius * this.sunsOrigin.scale);

        var that = this;

        if (distance < this.sunsOrigin.radius * this.sunsOrigin.scale)
        {
            this.destroyed = true;
        }
        //this.game.entities.forEach(function (item, index, array)
        //{
        //    if (item.size == .2)
        //    {
        //        that.pos = index;
        //        that.destroyed = true;
        //    }

        //});

        this.planetsOrigins.xPos = this.x - (this.frameWidth * this.size)/2;
        this.planetsOrigins.yPos = this.y - (this.frameHeight * this.size)/2;
            
    }

}

