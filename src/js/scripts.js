import { Back, Power0 } from 'gsap/all'
import { Engine, Render, Runner, Bodies, Constraint, Composite } from 'matter-js'
import gsap from 'gsap'

const ARROW_MASS = 1.2
const DOT_MASS = 1
const WHEEL_RADIUS = 200
const SECTORS_AMOUNT = 16
const PI = Math.PI

const windowHeight = document.body.offsetHeight
const windowWidth = document.body.offsetWidth

const engine = Engine.create()

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
    group: -1
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
    pointA: { x: 0, y: -20 },
    pointB: {
        x: windowWidth / 2,
        y: windowHeight / 2 - wheelReelHeight / 2 - 25
    },
    length: 0,
    anchors: true
})

const topPoint = Bodies.circle(windowWidth / 2, arrowBody.position.y - 70, 2, {
    isStatic: true
})
const topPointConstraints = Constraint.create({
    bodyA: arrowBody,
    pointA: { x: 1, y: 1 },
    bodyB: topPoint,
    pointB: { x: 1, y: 1 },
    stiffness: 0.1,
    length: 70
})

const stopperBodyLeft = Bodies.rectangle(arrowBody.position.x - 25 - 7, arrowBody.position.y, 50, 50, {
    isStatic: true
})

Composite.add(engine.world, [wheelReel, arrowBody, wheelReelConstraints, arrowConstraints, topPoint, topPointConstraints, stopperBodyLeft])

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

    Composite.add(engine.world, [dot, dotConstraints])
}

Render.run(render)

const runner = Runner.create()
Runner.run(runner, engine)

window.addEventListener('click', () => {

    gsap.timeline()
        .to(wheelReel, {
            angle: Math.PI * 2,
            ease: Back.easeIn.config(0.75),
            duration: 2.5
        }, 0)
        .fromTo(wheelReel, { angle: 0 }, {
            angle: Math.PI * 2,
            repeat: 3,
            duration: 0.7,
            ease: Power0.easeNone
        }, '>')
        .to(wheelReel, { angle: `+=${6 * Math.PI}`, duration: 6.2, ease: Back.easeOut.config(0) }, '>')
        .set(topPoint, { position: { x: windowWidth / 2 + 110, y: arrowBody.position.y + 30 } }, 2)
        .set(topPoint, { position: { x: windowWidth / 2, y: arrowBody.position.y - 70 } }, 6)

})
