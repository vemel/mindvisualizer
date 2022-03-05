const lerp = function (a, b, t) {
    return a + t * (b - a);
};

const lerpV2 = function (p0, p1, t) {
    return [
        lerp(p0[0], p1[0], t),
        lerp(p0[1], p1[1], t)
    ];
};

const lerpV3 = function (p0, p1, t) {
    return [
        lerp(p0[0], p1[0], t),
        lerp(p0[1], p1[1], t),
        lerp(p0[2], p1[2], t),
    ];
};

Easing = {
    // no easing, no acceleration
    linear: t => t,
    // accelerating from zero velocity
    easeInQuad: t => t * t,
    // decelerating to zero velocity
    easeOutQuad: t => t * (2 - t),
    // acceleration until halfway, then deceleration
    easeInOutQuad: t => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    // accelerating from zero velocity 
    easeInCubic: t => t * t * t,
    // decelerating to zero velocity 
    easeOutCubic: t => (--t) * t * t + 1,
    // acceleration until halfway, then deceleration 
    easeInOutCubic: t => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    // accelerating from zero velocity 
    easeInQuart: t => t * t * t * t,
    // decelerating to zero velocity 
    easeOutQuart: t => 1 - (--t) * t * t * t,
    // acceleration until halfway, then deceleration
    easeInOutQuart: t => t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
    // accelerating from zero velocity
    easeInQuint: t => t * t * t * t * t,
    // decelerating to zero velocity
    easeOutQuint: t => 1 + (--t) * t * t * t * t,
    // acceleration until halfway, then deceleration 
    easeInOutQuint: t => t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t
}

const distance = function(pt1, pt2) {
    return Math.pow(Math.pow(pt1[0] - pt2[0], 2) + Math.pow(pt1[1] - pt2[1], 2), 0.5)
}

const rotate = function(pt, center, angle) {
    const length = distance(pt, center)
    const origAngle = Math.atan2(pt[1] - center[1], pt[0] - center[0])
    const newAngle = origAngle + angle
    return [
        center[0] + length * Math.sin(newAngle),
        center[1] + length * Math.cos(newAngle),
    ]
}


window.vectors = {
    lerp,
    lerpV2,
    lerpV3,
    Easing,
    rotate,
    distance,
}