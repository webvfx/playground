// Amount of particles created per click
const PARTICLE_COUNT = 100;
// Array of active Particle instances
const ACTIVE_PARTICLES = [];
// Amount of frames particles should live
const PARTICLE_LIFESPAN_FRAMES = 200;

const GRAVITY = 0.06;
const AIR_RESISTANCE = 0.02;

const CONFETTI_COLOR_PRESETS = ["255, 99, 71", "70, 130, 180", "255, 215, 0"];

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

// set canvas size
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

// add resize handler
window.addEventListener("resize", () => {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
});

class Particle {
  constructor(options) {
    this.x = options.x;
    this.y = options.y;
    this.vx = Math.random() * 10 - 5;
    this.vy = -(Math.random() * 11 + 3);
    this.lifespan = 0;
    this.color = CONFETTI_COLOR_PRESETS[Math.floor(Math.random() * CONFETTI_COLOR_PRESETS.length)];
  }

  draw() {
    const progress = this.lifespan / PARTICLE_LIFESPAN_FRAMES;
    const alpha = 1 - progress;
    const fillStyle = `rgba(${this.color},${alpha})`;

    context.beginPath();
    context.arc(this.x, this.y, 2, Math.PI * 2, false);
    context.closePath();
    context.fillStyle = fillStyle;
    context.fill();
  }

  update() {
    // Apply gravity
    this.vy += GRAVITY;

    // Apply air resistance
    this.vx *= 1 - AIR_RESISTANCE;
    this.vy *= 1 - AIR_RESISTANCE;

    // Update position based on the velocity
    this.x += this.vx;
    this.y += this.vy;

    // Remove particles past it's lifespan
    if (this.lifespan > PARTICLE_LIFESPAN_FRAMES) {
      const index = ACTIVE_PARTICLES.indexOf(this);
      if (index !== -1) {
        ACTIVE_PARTICLES.splice(index, 1);
        return;
      }
    }

    // increment the lisfespan of this particle
    this.lifespan++;
    this.draw();
  }
}

const createNewParticles = (event) => {
  const {
    x,
    y
  } = event;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const particle = new Particle({
      x,
      y
    });
    ACTIVE_PARTICLES.push(particle);
  }
};

canvas.addEventListener("mousedown", createNewParticles);

const animationLoop = () => {
  // clear canvas
  context.clearRect(0, 0, innerWidth, innerHeight);

  // draw each particle
  for (let i = 0; i < ACTIVE_PARTICLES.length; i++) {
    ACTIVE_PARTICLES[i].update();
  }

  // Schedule next animation frame by invoking requestAnimationFrame
  requestAnimationFrame(animationLoop);
};

animationLoop();
