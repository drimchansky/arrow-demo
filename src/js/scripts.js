import Matter from 'matter-js'
import gsap from 'gsap'

// module aliases
const Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Constraint = Matter.Constraint,
    Composite = Matter.Composite;

const ARROW_MASS = 1.5
const DOT_MASS = 1
const WHEEL_RADIUS = 200
const SECTORS_AMOUNT = 16
const PI = Math.PI

const windowHeight = document.body.offsetHeight
const windowWidth = document.body.offsetWidth

// create an engine
const engine = Engine.create();

// create a renderer
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: windowWidth,
        height: windowHeight
    }
})

// wheel reel
const wheelReel = Bodies.circle(windowWidth / 2, windowHeight / 2, WHEEL_RADIUS)
const { min, max } = wheelReel.bounds
const wheelReelHeight = max.y - min.y
wheelReel.collisionFilter = {
    group: -1,
    'category': 2,
    'mask': 0,
}
const wheelReelConstraints = Constraint.create({
    bodyA: wheelReel,
    pointB: {
        x: windowWidth / 2,
        y: windowHeight / 2
    },
    length: 0,
    stiffness: 1,
    anchors: true
})

// arrow
const arrowBody = Bodies.rectangle(windowWidth / 2, windowHeight / 2 - wheelReelHeight / 2, 14, 40, {
    mass: ARROW_MASS
})
const arrowConstraints = Constraint.create({
    bodyA: arrowBody,
    pointA: {
        x: 0,
        y: -20
    },
    pointB: {
        x: windowWidth / 2,
        y: windowHeight / 2 - wheelReelHeight / 2 - 25
    },
    length: 0,
    anchors: true
})

Composite.add(engine.world, [wheelReel, arrowBody, wheelReelConstraints, arrowConstraints]);


const angle = PI * 2 / SECTORS_AMOUNT

for (let i = 0; i < SECTORS_AMOUNT; i ++) {

    const dot = Bodies.circle(0, 0, 5, {
        mass: DOT_MASS,
        friction: 0.5,
        restitution: 1
    })
    const dotConstraints = Constraint.create({
        bodyA: wheelReel,
        pointA: {
            x: WHEEL_RADIUS * Math.cos(angle * i + angle / 2),
            y: WHEEL_RADIUS * Math.sin(angle * i + angle / 2)
        },
        bodyB: dot,
        length: 0
    })

    Composite.add(engine.world, [dot, dotConstraints]);
}

Render.run(render);

const runner = Runner.create();
Runner.run(runner, engine);

window.addEventListener('click', () => {
    gsap.fromTo(wheelReel, { angle: 0 }, { angle: PI * 2, duration: 2 })
})

