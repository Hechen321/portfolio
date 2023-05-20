let planets = [
    { name: "Mercury", size: 5, speed: 0.025, color: [169, 169, 169] },
    { name: "Venus", size: 12, speed: 0.02, color: [218, 165, 32] },
    { name: "Earth", size: 12, speed: 0.017, color: [70, 130, 180], satellites: [{ name: "Moon", size: 3, speed: 0.04, color: [200, 200, 200], distance: 30 }] },
    { name: "Mars", size: 6, speed: 0.014, color: [139, 69, 19] },
    { name: "Jupiter", size: 40, speed: 0.011, color: [165, 42, 42] },
    { name: "Saturn", size: 35, speed: 0.009, color: [193, 154, 107], rings: { inner: 45, outer: 60, color: [193, 154, 107, 50] } },
    { name: "Uranus", size: 31, speed: 0.007, color: [72, 61, 139] },
];
let stars = [];
let mouseStars = [];
let angle = [];
let satelliteAngle = [];
let orbitRadius = [];
let satelliteOrbitRadius = [];
let asteroids = [];
let angleAsteroid = [];

for (let i = 0; i < planets.length; i++) {
    angle[i] = Math.random() * 360;
    orbitRadius[i] = 100 + 60 * i;
    if (planets[i].satellites) {
        satelliteAngle[i] = [];
        satelliteOrbitRadius[i] = [];
        for (let j = 0; j < planets[i].satellites.length; j++) {
            satelliteAngle[i][j] = Math.random() * 360;
            satelliteOrbitRadius[i][j] = planets[i].size + planets[i].satellites[j].distance;
        }
    }
}

for (let i = 0; i < 500; i++) {
    let asteroidRadius = 150 + 60 * 2 + Math.random() * 60;
    angleAsteroid[i] = Math.random() * 360;
    asteroids[i] = {
        radius: asteroidRadius,
        x: asteroidRadius * Math.cos(angleAsteroid[i]),
        y: asteroidRadius * Math.sin(angleAsteroid[i]),
        size: Math.random() * 1.5,
        speed: 0.005 + Math.random() * 0.005,
    };
}

let sketch = function (p) {
    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.angleMode(p.DEGREES);
        for (let i = 0; i < 200; i++) {
            stars[i] = {
                x: Math.random() * p.width,
                y: Math.random() * p.height,
                size: Math.random() * 2,
            };
        }
    };

    p.draw = function () {
        p.background(0);
        for (let i = 0; i < stars.length; i++) {
            stars[i].size = Math.random() * 2;
            p.stroke(255);
            p.strokeWeight(stars[i].size);
            p.point(stars[i].x, stars[i].y);
        }

        drawAndFadeMouseStars(p);

        p.translate(p.width / 2, p.height / 2);
        p.fill(255, 204, 0);
        p.noStroke();
        p.ellipse(0, 0, 50 * 2, 50 * 2);
        for (let i = 0; i < planets.length; i++) {
            let x = orbitRadius[i] * p.cos(angle[i]);
            let y = orbitRadius[i] * p.sin(angle[i]);
            p.fill(planets[i].color);
            p.ellipse(x, y, planets[i].size * 2, planets[i].size * 2);
            if (planets[i].satellites) {
                for (let j = 0; j < planets[i].satellites.length; j++) {
                    let satX = x + satelliteOrbitRadius[i][j] * p.cos(satelliteAngle[i][j]);
                    let satY = y + satelliteOrbitRadius[i][j] * p.sin(satelliteAngle[i][j]);
                    p.fill(planets[i].satellites[j].color);
                    p.ellipse(satX, satY, planets[i].satellites[j].size * 2, planets[i].satellites[j].size * 2);
                    satelliteAngle[i][j] += planets[i].satellites[j].speed;
                }
            }
            if (planets[i].rings) {
                p.noFill();
                p.stroke(planets[i].rings.color);
                p.strokeWeight(1);
                for (let radius = planets[i].rings.inner; radius <= planets[i].rings.outer; radius += 1) {
                    p.ellipse(x, y, radius * 2, radius * 2);
                }
            }
            angle[i] += planets[i].speed;
        }

        for (let i = 0; i < asteroids.length; i++) {
            asteroids[i].x = asteroids[i].radius * p.cos(angleAsteroid[i]);
            asteroids[i].y = asteroids[i].radius * p.sin(angleAsteroid[i]);
            p.fill(120, 120, 120);
            p.ellipse(asteroids[i].x, asteroids[i].y, asteroids[i].size * 2, asteroids[i].size * 2);
            angleAsteroid[i] += asteroids[i].speed;
        }

        if (mouseStars.length < 50) {
            addStarAroundMouse(p);
        }
    };

    p.mouseMoved = function () {
        addStarAroundMouse(p);
    };

    function addStarAroundMouse(p) {
        let star = {
            x: p.mouseX + Math.random() * 100 - 50,
            y: p.mouseY + Math.random() * 100 - 50,
            size: Math.random() * 2,
            createTime: p.millis(),
        };
        mouseStars.push(star);
    }

    function drawAndFadeMouseStars(p) {
        for (let i = mouseStars.length - 1; i >= 0; i--) {
            let star = mouseStars[i];
            let timePassed = p.millis() - star.createTime;
            if (timePassed > 4000) {
                mouseStars.splice(i, 1);
                continue;
            }
            let alpha = p.map(timePassed, 0, 4000, 255, 0);
            p.stroke(255, alpha);
            p.strokeWeight(star.size);
            p.point(star.x, star.y);
        }
    }
};

new p5(sketch);
