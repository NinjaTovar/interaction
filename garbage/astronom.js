/* Initial Conditions for the angle and distance ( coordinate system for two solar body orbit )
 * 
 * This will initially represent the Sun and the Earth, based on the example found at
 * https://evgenii.com/blog/earth-orbit-simulation/. I am heavily invested in studying the
 * math behind these, with my completed minor in math invested in differential equations and the rates of 
 * change. I spent a good amount of time pouring over the equations found on this page and
 * understanding these partial derivatives, Langrange Multipliers (mathmematical optimizers)
 * and solar/gravitational constants. This is not a cut/paste operation.
 * 
 * The intial conditions represent:
 *
 * r =  the initial distance between the center of the Sun and the center of the Earth.
 * Theta = the angle between them in a polar coordinate system.
*/


// Initial Conditions ********************************************************************
var initialConditions = {

    // Distance is equal to the length of the astronomical unti (AU), which is the average
    // distance between the Earth and the Sun. There is some cool info on this measurement
    // along with diagrams here: https://en.wikipedia.org/wiki/Astronomical_unit
    distance: {
        value: 1.496 * Math.pow(10, 11),
        // this is the first derivative of the distance (velocity) of the Earth in the
        // direction of the Sun. You can see there is only orbit and no decay at this
        // point, meaning it will not crash into it.
        speed: 0.00 
    },

    // The angle is arbitrary. It does not matter what angle the simulation begin at.
    angle: {
        value: Math.PI / 6,

        // The Earth makes a full revolution in one year, so speed is calculated using 
        // 2
        speed: 1.990986 * Math.pow(10, -7)
    }
};

// Storing the state of the simulation ***************************************************
/*
 *  The initial conditions describe the system at the start of the simulation. As time 
 *  changes the Earth will move and the four parameters will change as well. Therefore, 
 *  in our program we need to store the current state of the system, which is represented 
 *  by the same four values: position, angle and their time derivatives, or speeds.
*/
var state = {
    distance: {
        value: 0,
        speed: 0
    },
    angle: {
        value: 0,
        speed: 0
    }
};

// Computing the acceleration of the distance r ******************************************
/**
 * We have set the initial conditions for the distance r and we know how it evolves from 
 * Equation 5. Now we can simply write this equation in our program as a function 
 * calculateDistanceAcceleration that computes the second time derivative of the distance 
 * r given the current state.
 * 
 * @param {any} state
 */
function calculateDistanceAcceleration(state)
{
    return state.distance.value * Math.pow(state.angle.speed, 2) -
        (constants.gravitationalConstant * state.massOfTheSunKg) / Math.pow(state.distance.value, 2);
}

//Computing the acceleration of the angle theta ******************************************
/**
 * Similarly, we write the second equation of motion (Equation 8) for the angle as a
 * function calculateAngleAcceleration.
 * 
 * @param {any} state
 */
function calculateAngleAcceleration(state)
{
    return -2.0 * state.distance.speed * state.angle.speed / state.distance.value;
}

// Finding a value from its derivative with Euler's method *******************************
/**
 * 
 * @param {any} currentValue
 * @param {any} deltaT
 * @param {any} derivative
 */
function newValue(currentValue, deltaT, derivative)
{
    return currentValue + deltaT * derivative;
}

// Finding the distance r ****************************************************************
/*
 * Now we are ready to bring all pieces together and write the code that computes the 
 * distance r from its second derivative. First, we use the function 
 * calculateDistanceAcceleration to calculate the acceleration r. Then we call newValue 
 * to find the speed by using the acceleration. And finally, we use the speed to 
 * find the distance r itself.
 */ 
var distanceAcceleration = calculateDistanceAcceleration(state);

state.distance.speed = newValue(state.distance.speed,
    deltaT, distanceAcceleration);

state.distance.value = newValue(state.distance.value,
    deltaT, state.distance.speed);

// Finding the angle theta ***************************************************************
/**
 * We use exactly the same procedure to find the angle theta, First, we find its acceleration 
 * with the function calculateAngleAcceleration. Then, we use it to find the angular speed 
 * by calling the function newValue. And finally, we compute the angle theta from its angular 
 * speed:
 * 
 */
var angleAcceleration = calculateAngleAcceleration(state);

state.angle.speed = newValue(state.angle.speed,
    deltaT, angleAcceleration);

state.angle.value = newValue(state.angle.value,
    deltaT, state.angle.speed);